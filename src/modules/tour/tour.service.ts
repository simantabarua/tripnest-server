import { ITour } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error(
      "Tour with this title already exists in the specified division"
    );
  }
  if (payload.title) {
    payload.slug = payload.title.toLowerCase().replace(/ /g, "-");
  }
  const tour = await Tour.create(payload);
  return tour;
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }
  if (!payload) {
    throw new Error("No update data provided");
  }
  if (payload.title) {
    payload.slug = payload.title.toLowerCase().replace(/ /g, "-");
  }
  const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
  });

  return updatedTour;
};

const deleteTour = async (tourId: string) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }
  await Tour.findByIdAndDelete(tourId);
  return { message: "Tour deleted successfully" };
};

const getTourById = async (tourId: string) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error("Tour not found");
  }
  return tour;
};

const getAllTours = async () => {
  const tours = await Tour.find();
  return tours;
};

const createTourType = async (name: string) => {
  const existingTourType = await TourType.findOne({ name });
  if (existingTourType) {
    throw new Error("Tour type already exists");
  }
  const tourType = await TourType.create({ name });
  return tourType;
};
const deleteTourType = async (tourTypeId: string) => {
  const tourType = await TourType.findById(tourTypeId);
  if (!tourType) {
    throw new Error("Tour type not found");
  }
  await TourType.findByIdAndDelete(tourTypeId);
  return { message: "Tour type deleted successfully" };
};
const getAllTourTypes = async () => {
  const tourTypes = await TourType.find();
  return tourTypes;
};
export const TourService = {
  createTour,
  updateTour,
  deleteTour,
  getTourById,
  getAllTours,
  createTourType,
  deleteTourType,
  getAllTourTypes,
};
