export const formatAgentResponse = (text: string): string => {
  if (!text || text === 'N/A') return text;
  
  let formatted = text;
  
  if (formatted.includes('\\n')) {
    formatted = formatted.replace(/\\n/g, '\n');
  }
  

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>');
  formatted = formatted.replace(/🚩\s*(Red Flags)/g, '<span class="font-semibold text-red-600">🚩 Red Flags</span>');
  formatted = formatted.replace(/✅\s*(Green Flags)/g, '<span class="font-semibold text-green-600">✅ Green Flags</span>');
  
  return formatted;
};

export const createMarkup = (htmlString: string) => {
  return { __html: htmlString };
};