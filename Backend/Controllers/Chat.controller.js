import { generatestreamToken } from "../DB/stream.js";
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";


const getstreamToken = asyncHandler(async (req, res) => {
  const userId = req.user._id; // assuming user is authenticated

  const streamToken = generatestreamToken(userId);
  if (!streamToken) {
    throw new apiError(500, "Failed to generate stream token");
  }

  res.status(200).json(new apiResponse(streamToken, 200, "Stream token generated successfully"));
});

export {getstreamToken};