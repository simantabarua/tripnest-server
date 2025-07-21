import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String, default: null },
    description: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name") && !this.slug) {
    const baseSlug = this.name.toLowerCase().replace(/ /g, "-");
    let slug = `${baseSlug}-division`;
    let counter = 1;

    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.slug = slug;
  }

  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
