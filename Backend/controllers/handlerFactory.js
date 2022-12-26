const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const APIFeatures = require("./apiFeatures");
exports.getAll = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.find();
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const data = await features.query;
    if (!data) return next(new AppError("No data found", 404));
    res.status(200).json({
      status: "success",
      data,
    });
  });
};
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    req.body.userId = req.user._id;
    const data = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      data,
    });
  });
};
exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    await Model.findByIdAndRemove(req.params.id);
    res.status(201).json({
      status: "success",
    });
  });
};
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) return next(new AppError("No document found with that id", 404));

    res.status(200).json({
      status: "success",
      data,
    });
  });
};
