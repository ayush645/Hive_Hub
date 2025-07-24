import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";
import PlanCard from "../../components/plansCards";
import storeService from "../../services/storeService";
import { ArrowForward } from "@mui/icons-material";
import { Modal } from "antd";
import StripePayments from "./payments";

const Plans = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(29);
  const [open, setOpen] = useState(false);
  const [selectPlan, setSelectPlan] = useState({});
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await storeService.getPlans();
        setPlans(response?.plans);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ position: "relative", height: "100%" }}>
        <Box sx={{ p: 4 }}>
          {/* Welcome Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ mb: 4, fontWeight: "bold", color: "#333" }}
            >
              Buy Subscription
            </Typography>
            {selectPlan?._id && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
                endIcon={<ArrowForward />}
                sx={{
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                }}
              >
                Proceed to Payment
              </Button>
            )}
          </Box>

          {/* Offers Section */}
          <Box>
            <Grid
              container
              spacing={4}
              alignItems="stretch"
              justifyContent="center"
            >
              {loading ? (
                <Grid
                  size={{ xs: 12 }}
                  sx={{ display: "flex", justifyContent: "center", py: 5 }}
                >
                  <CircularProgress />
                </Grid>
              ) : plans?.filter((plan) => plan.durationInDays === selectedPlan)
                  .length === 0 ? (
                <Grid size={{ xs: 12 }} sx={{ textAlign: "center", py: 5 }}>
                  <Typography variant="h6" color="text.secondary">
                    No plans found for the selected duration
                  </Typography>
                </Grid>
              ) : (
                plans
                  .filter((plan) => plan.durationInDays === selectedPlan)
                  .map((offer) => (
                    <Grid
                      key={offer._id}
                      size={{ xs: 12, md: 3 }}
                      sx={{
                        display: "flex",
                        justifyContent: "center", // Horizontally center
                        alignItems: "center", // Vertically center (optional)
                      }}
                    >
                      <PlanCard
                        plan={offer}
                        selectPlan={selectPlan}
                        setSelectPlan={setSelectPlan}
                      />
                    </Grid>
                  ))
              )}
            </Grid>
          </Box>

          {/* Personalized Recommendations */}
          <Box sx={{ position: "absolute", bottom: "5%", left: 0, right: 0 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              Personalized Recommendations
            </Typography>

            <Box display="flex" justifyContent="center">
              <ButtonGroup
                variant="contained"
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.primary.main}`,
                })}
              >
                <Button
                  sx={{
                    backgroundColor: selectedPlan === 29 ? "primary" : "white",
                    color: selectedPlan === 29 ? "white" : "black",
                    width: 200,
                    borderRadius: "inherit",
                  }}
                  onClick={() => setSelectedPlan(29)}
                >
                  Monthly
                </Button>
                <Button
                  sx={{
                    backgroundColor: selectedPlan === 365 ? "primary" : "white",
                    color: selectedPlan === 365 ? "white" : "black",
                    width: 200,
                    borderRadius: "inherit",
                  }}
                  onClick={() => setSelectedPlan(365)}
                >
                  Yearly{" "}
                  <span
                    style={{
                      color: selectedPlan === 365 ? "white" : "gray",
                      marginLeft: 4,
                    }}
                  >
                    (Save 2.5%)
                  </span>
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        open={open}
        footer={null}
        closable={false}
        onClose={() => setOpen(false)}
      >
        <StripePayments plan={selectPlan} setOpen={setOpen} />
      </Modal>
    </React.Fragment>
  );
};

export default Plans;
