import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RatingModalProps {
  onSubmit: (rating: number) => void;
  onSkip: () => void;
}

const RatingModal = ({ onSubmit, onSkip }: RatingModalProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onSubmit(selectedRating);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-purple-500/30 p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-4">
            <Icon name="MessageCircle" size={48} className="text-purple-500 mx-auto" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Оцените качество обслуживания
          </h2>
          <p className="text-gray-400 mb-6">
            Ваше мнение поможет нам стать лучше
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Icon
                  name="Star"
                  size={40}
                  className={`${
                    star <= (hoveredRating || selectedRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-600'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Пропустить
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedRating === 0}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Отправить оценку
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RatingModal;
