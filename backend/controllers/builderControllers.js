import Portfolio from "../models/builderModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";

// helper for Cloudinary upload (returns url + public_id)
const uploadToCloudinary = (fileBuffer, folder = "portfolio") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

//  Portfolio
export const addPortfolio = async (req, res) => {
  try {
    const { company, experience, address, description } = req.body;
    const builderId = req.user?._id;

    if (!company || !experience || !address || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    let logoObj;
    if (req.file) {
      logoObj = await uploadToCloudinary(req.file.buffer, "logos");
    }

    const newPortfolio = new Portfolio({
      company: company.trim(),
      experience,
      address,
      description,
      logo: logoObj,
      createdBy: builderId
    });

    await newPortfolio.save();
    res.status(201).json({ success: true, portfolio: newPortfolio });
  } catch (error) {
    console.error("Add portfolio failed:", error);
    res.status(500).json({ error: "Server error while adding portfolio" });
  }
};

// Get Portfolio
export const getPortfolio = async (req, res) => {
  try {
    const builderId = req.user?._id;
    const portfolio = await Portfolio.findOne({ createdBy: builderId });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    res.status(200).json({ success: true, portfolio });
  } catch (error) {
    console.error("Get portfolio failed:", error);
    res.status(500).json({ error: "Server error while fetching portfolio" });
  }
};

// Update Portfolio
export const updatePortfolio = async (req, res) => {
  try {
    const { company, experience, address, description } = req.body;
    const builderId = req.user?._id;

    const portfolio = await Portfolio.findOne({ createdBy: builderId });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    portfolio.company = company || portfolio.company;
    portfolio.experience = experience || portfolio.experience;
    portfolio.address = address || portfolio.address;
    portfolio.description = description || portfolio.description;

    if (req.file) {
      // delete old logo if exists
      if (portfolio.logo?.public_id) {
        await cloudinary.v2.uploader.destroy(portfolio.logo.public_id);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, "logos");
      portfolio.logo = uploadResult;
    }

    await portfolio.save();
    res.status(200).json({ success: true, portfolio });
  } catch (error) {
    console.error("Update portfolio failed:", error);
    res.status(500).json({ error: "Server error while updating portfolio" });
  }
};

// Delete Portfolio Logo
export const deletePortfolioLogo = async (req, res) => {
  try {
    const builderId = req.user?._id;
    const portfolio = await Portfolio.findOne({ createdBy: builderId });

    if (!portfolio || !portfolio.logo?.public_id) {
      return res.status(404).json({ error: "Logo not found" });
    }

    await cloudinary.v2.uploader.destroy(portfolio.logo.public_id);
    portfolio.logo = undefined;
    await portfolio.save();

    res.status(200).json({ success: true, message: "Logo deleted successfully" });
  } catch (error) {
    console.error("Delete logo failed:", error);
    res.status(500).json({ error: "Server error while deleting logo" });
  }
};

// Add a Past Work
export const addPastWork = async (req, res) => {
  try {
    const builderId = req.user?._id;
    if (!builderId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const portfolio = await Portfolio.findOne({ createdBy: builderId });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found. Add portfolio first." });
    }

    const { title, description, price, specialties } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ error: "Title, description, and price are required" });
    }

    const images = [];

    // Upload images to Cloudinary if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "pastWorks" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
        images.push(uploadResult.secure_url);
      }
    }

    const newPastWork = {
      title,
      description,
      price,
      specialties: specialties ? specialties.split(",").map(s => s.trim()) : [],
      images,
    };

    portfolio.pastWorks.push(newPastWork);
    await portfolio.save();

    res.status(201).json({ success: true, pastWork: newPastWork });
  } catch (error) {
    console.error("Add past work failed:", error);
    res.status(500).json({ error: "Server error while adding past work" });
  }
};

// Delete a Past Work
export const deletePastWork = async (req, res) => {
  try {
    const builderId = req.user?._id;
    const { id } = req.params; // past work id

    if (!builderId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const portfolio = await Portfolio.findOne({ createdBy: builderId });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const pastWorkIndex = portfolio.pastWorks.findIndex(
      (work) => work._id.toString() === id
    );

    if (pastWorkIndex === -1) {
      return res.status(404).json({ error: "Past work not found" });
    }

    // Remove the past work
    portfolio.pastWorks.splice(pastWorkIndex, 1);
    await portfolio.save();

    res.status(200).json({ success: true, message: "Past work deleted successfully" });
  } catch (error) {
    console.error("Delete past work failed:", error);
    res.status(500).json({ error: "Server error while deleting past work" });
  }
};
