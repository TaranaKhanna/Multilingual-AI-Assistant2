import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const models = [
  { id: 'llama3-70b-8192', name: 'Llama 3 (70B)' },
  { id: 'llama3-70b-8192-instruct', name: 'Llama 3 Instruct (70B)' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral (8x7B)' },
  { id: 'gemma-7b-it', name: 'Gemma (7B)' }
];

const ModelSelector = ({ onModelChange, currentModel = 'llama3-70b-8192' }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleModelSelect = (modelId) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  const currentModelName = models.find(model => model.id === currentModel)?.name || models[0].name;

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentModelName}</span>
        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 max-h-60 overflow-auto">
            {models.map((model) => (
              <button
                key={model.id}
                className={`block w-full px-4 py-2 text-sm text-left ${
                  model.id === currentModel
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ModelSelector.propTypes = {
  onModelChange: PropTypes.func.isRequired,
  currentModel: PropTypes.string
};

export default ModelSelector;
