import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  List,
  ListItem,
  IconButton,
  Card,
} from "@mui/material";
import PlanCard from "../../../components/plansCards";
import {
  BorderColorOutlined,
  DeleteOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import adminPlansServices from "../../../services/adminPlansServices";
import DeleteConfirm from "../../../components/deleteConfirm";
import { useSnackbar } from "../../../features/snackBar";

const ManagePlans = ({ setOpen, selectPlan, setSelectPlan }) => {
  const { showSnackbar } = useSnackbar();
  const [plans, setPlans] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: null,
  });
  const [loading, setLoading] = useState({
    type: null,
    planId: null,
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading({ type: "get", planId: null });
        const response = await adminPlansServices.getAdminPlans();
        setPlans(response?.plans);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading({ type: null, planId: null });
      }
    };
    fetchPlans();
  }, []);

  const handleDelete = async () => {
    try {
      setLoading({ type: "delete", planId: confirmDelete?.id });
      const response = await adminPlansServices.deletePlan(confirmDelete?.id);
      if (response) {
        showSnackbar(
          response?.message || "Plan deleted successfully",
          "success"
        );
        setPlans(plans.filter((plan) => plan._id !== confirmDelete.id));
      } else {
        showSnackbar(response?.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
      showSnackbar(
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading({ type: null, planId: null });
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleEditPlan = () => {
    if (selectPlan) {
      setOpen(true);
    } else {
      showSnackbar("Please select a plan to edit", "error");
    }
  };

  const handleToggleActive = async (planId) => {
    try {
      setLoading({ type: "activateORDeactivate", planId });
      const response = await adminPlansServices.activateORDeactivatePlan(
        planId
      );
      if (response) {
        showSnackbar(
          response?.message || "Plan updated successfully",
          "success"
        );
        setPlans(
          plans.map((plan) => (plan._id === planId ? response?.plan : plan))
        );
      } else {
        showSnackbar(response?.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({ type: null, planId: null });
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Manage Plans</Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (selectPlan) {
              setSelectPlan(null);
            }
            setOpen(true);
          }}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          Create Plan
        </Button>
      </Box>
      <Box sx={{ width: "100%", minHeight: "60vh", py: 4 }}>
        {loading.type === "get" ? (
          // Loading State
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : plans.length === 0 ? (
          // Empty State
          <Box
            sx={{
              textAlign: "center",
              py: 5,
            }}
          >
            <Typography variant="h5" color="text.secondary">
              No plans found
            </Typography>
          </Box>
        ) : (
          // Data Grid
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid
                key={plan._id}
                item
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlanCard
                  plan={plan}
                  selectPlan={selectPlan}
                  setSelectPlan={setSelectPlan}
                  isAdmin={{
                    loading,
                    handleToggleActive,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Card
        sx={{
          position: "sticky",
          bottom: "2em",
          left: 0,
          right: 0,
          backgroundColor: "#000",
          padding: "0.6em 2em",
          borderRadius: "50px",
          margin: "auto",
          transition: "all 0.1s ease-in-out",
          "&:hover": {
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            transform: "translateY(-5px)",
          },
        }}
      >
        <List
          sx={{
            display: "flex",
            gap: "4em",
            justifyContent: "space-between",
            padding: 0,
            margin: 0,
          }}
        >
          <ListItem sx={{ padding: 0, justifyContent: "center" }}>
            <IconButton sx={{ borderRadius: "50%" }} onClick={handleEditPlan}>
              <BorderColorOutlined sx={{ color: "white", fontSize: "1.4em" }} />
            </IconButton>
          </ListItem>
          <ListItem sx={{ padding: 0, justifyContent: "center" }}>
            <IconButton
              sx={{ borderRadius: "50%" }}
              onClick={() => {
                if (selectPlan) {
                  setConfirmDelete({ open: true, id: selectPlan._id });
                } else {
                  showSnackbar("Please select a plan to delete", "error");
                }
              }}
            >
              {loading.type === "delete" &&
              loading.planId === selectPlan._id ? (
                <CircularProgress size={20} />
              ) : (
                <DeleteOutlined sx={{ color: "white", fontSize: "1.4em" }} />
              )}
            </IconButton>
          </ListItem>
          <ListItem sx={{ padding: 0, justifyContent: "center" }}>
            <IconButton sx={{ borderRadius: "50%" }}>
              <SettingsOutlined sx={{ color: "white", fontSize: "1.4em" }} />
            </IconButton>
          </ListItem>
        </List>
      </Card>
      <DeleteConfirm
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleDelete={handleDelete}
        actionLoading={loading}
        type="plan"
      />
    </Box>
  );
};

export default ManagePlans;
