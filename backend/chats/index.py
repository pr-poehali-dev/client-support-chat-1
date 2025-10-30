'''
Business: Manage chat operations - create, assign, update status, send messages
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with chat data and messages
'''
import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        action = params.get('action', 'list')
        
        if action == 'list':
            operator_id = params.get('operator_id')
            if operator_id:
                cur.execute(
                    "SELECT id, client_id, operator_id, status, topic, created_at FROM chats WHERE operator_id = %s ORDER BY created_at DESC",
                    (operator_id,)
                )
            else:
                cur.execute("SELECT id, client_id, operator_id, status, topic, created_at FROM chats ORDER BY created_at DESC LIMIT 50")
            
            chats = cur.fetchall()
            result = []
            for chat in chats:
                result.append({
                    'id': chat[0],
                    'client_id': chat[1],
                    'operator_id': chat[2],
                    'status': chat[3],
                    'topic': chat[4],
                    'created_at': str(chat[5])
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'chats': result})
            }
        
        elif action == 'messages':
            chat_id = params.get('chat_id')
            cur.execute(
                "SELECT id, sender_type, sender_id, message, created_at FROM messages WHERE chat_id = %s ORDER BY created_at ASC",
                (chat_id,)
            )
            messages = cur.fetchall()
            result = []
            for msg in messages:
                result.append({
                    'id': msg[0],
                    'sender_type': msg[1],
                    'sender_id': msg[2],
                    'message': msg[3],
                    'created_at': str(msg[4])
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'messages': result})
            }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'create_chat':
            session_id = body_data.get('session_id')
            client_name = body_data.get('client_name', 'Клиент')
            
            cur.execute("SELECT id FROM clients WHERE session_id = %s", (session_id,))
            client = cur.fetchone()
            
            if not client:
                cur.execute("INSERT INTO clients (session_id, name) VALUES (%s, %s) RETURNING id", (session_id, client_name))
                client_id = cur.fetchone()[0]
            else:
                client_id = client[0]
            
            cur.execute("SELECT id FROM users WHERE status = 'online' AND role = 'operator' ORDER BY id LIMIT 1")
            operator = cur.fetchone()
            operator_id = operator[0] if operator else None
            
            cur.execute(
                "INSERT INTO chats (client_id, operator_id, status) VALUES (%s, %s, 'active') RETURNING id",
                (client_id, operator_id)
            )
            chat_id = cur.fetchone()[0]
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'chat_id': chat_id, 'client_id': client_id})
            }
        
        elif action == 'send_message':
            chat_id = body_data.get('chat_id')
            sender_type = body_data.get('sender_type')
            sender_id = body_data.get('sender_id')
            message = body_data.get('message')
            
            cur.execute(
                "INSERT INTO messages (chat_id, sender_type, sender_id, message) VALUES (%s, %s, %s, %s) RETURNING id",
                (chat_id, sender_type, sender_id, message)
            )
            message_id = cur.fetchone()[0]
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message_id': message_id})
            }
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'complete':
            chat_id = body_data.get('chat_id')
            topic = body_data.get('topic')
            
            cur.execute(
                "UPDATE chats SET status = 'completed', topic = %s, completed_at = %s WHERE id = %s",
                (topic, datetime.now(), chat_id)
            )
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 400,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid request'})
    }
