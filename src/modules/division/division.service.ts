import { Division } from "./division.model";

const createDivision = async (divisionData) => {
  const existingDivision = await Division.findOne({ name: divisionData.name });
  if (existingDivision) {
    throw new Error("Division already exists");
  }
  const division = await Division.create(divisionData);
  return division;
};

const updateDivision = async (id, divisionData) => {
  const existingDivision = await Division.findById(id);
  if (!existingDivision) {
    throw new Error("Division not found");
  }
  if (!divisionData) {
    throw new Error("No data provided for update");
  }
  const duplicateDivision = await Division.findOne({
    name: divisionData.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new Error("Division with this name already exists");
  }
  const updatedDivision = await Division.findByIdAndUpdate(id, divisionData, {
    new: true,
  });
  return updatedDivision;
};

const deleteDivision = async (id) => {
  const division = await Division.findByIdAndDelete(id);
  if (!division) {
    throw new Error("Division not found");
  }
  return division;
};

const getSingleDivision = async (id) => {
  const division = await Division.findById(id);
  if (!division) {
    throw new Error("Division not found");
  }
  return division;
};

const getAllDivisions = async () => {
  const divisions = await Division.find();
  return divisions;
};

export const DivisionService = {
  createDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
  getAllDivisions,
};
