const mongoose = require("mongoose")
const slugify = require("slugify")

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have Name'],
    unique: true,
    trim: true,
    minlength: [10, 'Minimum length of Tour name should be 10 character'],
    maxlength: [40, 'Maximum length of Tour name should be 40 character']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A Tour must have Duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have Group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have Difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty value does not match the enum Values'
    }
  },
  ratingAverage: {
    type: Number,
    default: 4.8,
    min: [1, 'Rating should be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have Price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price
      },
      message: 'Discount Price ({VALUE}) has to be less than Price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a Description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// tourSchema.index({ price: 1})
tourSchema.index({ price: 1, ratingAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

// virtual properties
tourSchema.virtual('durationinweek').get(function () {
  return this.duration / 7;
})

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
})

// document middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// tourSchema.pre('save', async function (next) {
//   this.guidesPromises = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(this.guidesPromises)
//   next()
// })

tourSchema.post('save', function (doc, next) {
  // console.log(doc)
  next()
})

// query middleware
tourSchema.pre(/^find/g, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = new Date()
  next();
})

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  })
  next()
})

tourSchema.post(/^find/g, function (doc, next) {
  console.log(`Query took : ${Date.now() - this.start} in milliseconds`)
  // console.log(doc);
  next()
})

// aggregate middleware
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({$match : {secretTour : {$ne: true}}}),
//   console.log(this.pipeline())
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour