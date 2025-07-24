const Campaign = require('../models/Campaign');
const Store = require('../models/Store');

// CREATE campaign (with optional schedule)
const createCampaign = async (req, res) => {
  try {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const { type, platformCampaignId, startDate, endDate } = req.body;
    // validation as per requirement

    const campaign = await Campaign.create({
      storeId: store._id,
      type,
      platformCampaignId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    res.status(201).json({ message: 'Campaign created', campaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET all campaigns for a storeOwner
const getMyCampaigns = async (req, res) => {
  try {
    const store = await Store.findOne({ ownerId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const campaigns = await Campaign.find({ storeId: store._id });
    res.status(200).json({ campaigns });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};

// DASHBOARD for store owner / admin
const getCampaignDashboardStats = async (req, res) => {
  try {
    const match = req.user.role === 'admin' ? {} : { storeId: req.store._id };

    const stats = await Campaign.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
          totalImpressions: { $sum: '$metrics.impressions' },
          totalClicks: { $sum: '$metrics.clicks' },
          totalConversions: { $sum: '$metrics.conversions' }
        }
      }
    ]);

    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error });
  }
};

// UPDATE campaign status manually
const updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    campaign.status = status;
    await campaign.save();
    res.status(200).json({ message: 'Status updated', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
};

// UPDATE campaign metrics (manual or webhook)
const updateCampaignMetrics = async (req, res) => {
  try {
    const { impressions, clicks, conversions } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    campaign.metrics.impressions += impressions || 0;
    campaign.metrics.clicks += clicks || 0;
    campaign.metrics.conversions += conversions || 0;
    await campaign.save();
    res.status(200).json({ message: 'Metrics updated', metrics: campaign.metrics });
  } catch (error) {
    res.status(500).json({ message: 'Error updating metrics', error });
  }
};

// AUTO START scheduled campaigns (via cron job)
const autoStartScheduledCampaigns = async () => {
  const now = new Date();
  const campaigns = await Campaign.updateMany(
    { status: 'scheduled', startDate: { $lte: now } },
    { $set: { status: 'running' } }
  );
  console.log(`[Campaigns] Auto-started ${campaigns.modifiedCount} scheduled campaigns.`);
};

// AUTO COMPLETE expired campaigns
const autoCompleteFinishedCampaigns = async () => {
  const now = new Date();
  const result = await Campaign.updateMany(
    { status: { $in: ['scheduled', 'running'] }, endDate: { $lte: now } },
    { $set: { status: 'completed' } }
  );
  console.log(`[Campaigns] Auto-completed ${result.modifiedCount} campaigns.`);
};

// INTEGRATE with Google Ads API (mock)
const syncWithGoogleAds = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    // Mock fetch from Google API...
    const data = {
      impressions: 1000,
      clicks: 120,
      conversions: 18
    };
    campaign.metrics = data;
    await campaign.save();
    res.status(200).json({ message: 'Synced with Google Ads', metrics: data });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing with Google Ads', error });
  }
};


// INTEGRATE with Facebook Ads API (mock)
const syncWithFacebookAds = async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      const data = {
        impressions: 750,
        clicks: 90,
        conversions: 12
      };
      campaign.metrics = data;
      await campaign.save();
      res.status(200).json({ message: 'Synced with Facebook Ads', metrics: data });
    } catch (error) {
      res.status(500).json({ message: 'Error syncing with Facebook Ads', error });
    }
  };

module.exports = {
  createCampaign,
  updateCampaignStatus,
  getMyCampaigns,
  updateCampaignMetrics,
  autoStartScheduledCampaigns,
  autoCompleteFinishedCampaigns,
  getCampaignDashboardStats,
  syncWithGoogleAds,
  syncWithFacebookAds
};
