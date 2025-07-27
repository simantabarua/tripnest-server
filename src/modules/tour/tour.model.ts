import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title") && !this.slug) {
    const baseSlug = this.title.toLowerCase().replace(/ /g, "-");
    let slug = `${baseSlug}-tour`;
    let counter = 1;

    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});
tourSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<ITour>;
  if (update.title && !update.slug) {
    const baseSlug = update.title.toLowerCase().replace(/ /g, "-");
    let slug = `${baseSlug}-tour`;
    let counter = 1;

    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    update.slug = slug;
  }
  this.setUpdate(update);
  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
