import { rateImage as apiRateImage } from '../api';

export function useRatings(updateLocalRating, collectionId) {
  async function rate(filename, rating) {
    await apiRateImage(filename, rating, collectionId);
    updateLocalRating(filename, rating);
  }

  return { rate };
}
