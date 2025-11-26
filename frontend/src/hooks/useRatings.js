import { rateImage as apiRateImage } from '../api';

export function useRatings(updateLocalRating) {
  async function rate(filename, rating) {
    await apiRateImage(filename, rating);
    updateLocalRating(filename, rating);
  }

  return { rate };
}
