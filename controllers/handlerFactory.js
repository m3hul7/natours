const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

const APIfeatures = require("./../utils/apiFeatures")

exports.deleteOne = Model => catchAsync(async (req, res, next) => {

  const doc = await Model.findByIdAndDelete(req.params.id)

  if (!doc) {
    return next(new AppError('No document found with that ID', 404))
  }

  res.status(204).json({
    status: "success",
    data: null
  })
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {

  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: "success",
    data: {
      data: doc
    }
  })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {

  const doc = await Model.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      data: doc
    }
  })
})

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {

  // internally uses findOne query method
  const query = Model.findById(req.params.id)
  if (popOptions) query.populate(popOptions)
  const doc = await query

  if (!doc) {
    return next(new AppError('No document found with that ID', 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc
    }
  })
})

exports.getAll = Model => catchAsync(async (req, res, next) => {

  let filter = {}
  if (req.params.tourId) filter = { tour: req.params.tourId }

  const apiFeat = new APIfeatures(Model.find(), req.query).filter(filter).sort().fields().pagination()
  // const docs = await apiFeat.query.explain()
  const docs = await apiFeat.query

  res.status(200).json({
    status: "success",
    timeofreq: req.timeofreq,
    results: docs.length,
    data: {
      data: docs
    }
  })
})