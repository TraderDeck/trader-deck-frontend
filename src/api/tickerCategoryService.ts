import apiClient from './apiClient';
import debounce from 'lodash/debounce';

const DEBOUNCER_DELAY = 500;

const updateTickerCategoryApi = (tickerSymbol: string, category: string) => {
  return apiClient.post('/ticker-category/update', null, {
    params: { tickerSymbol, category }
  })
};

export const saveTickerCategory = debounce(updateTickerCategoryApi, DEBOUNCER_DELAY);

export const getCurrentCategories = (tickerSymbols: string[]) => {
    console.log("Params to be passed are: ", { params: { tickerSymbols } });
const categories = apiClient.get('/ticker-category/current-all', { params: { 
    tickerSymbols: tickerSymbols.join(","),

} });
return categories;
}

export const getCurrentCategory = (tickerSymbol : string) => apiClient.get(`/ticker-category/current/${tickerSymbol}`);
export const getCategoryHistory = (tickerSymbol : string) => apiClient.get(`/ticker-category/history/${tickerSymbol}`);


