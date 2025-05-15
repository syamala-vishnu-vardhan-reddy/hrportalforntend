import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Rating,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  fetchPerformances,
  updatePerformanceReview,
} from "../../redux/slices/performanceSlice";

// Mock data for performance review
const mockReview = {
  id: "1",
  employeeId: "1",
  employeeName: "John Doe",
  reviewerId: "2",
  reviewerName: "Jane Smith",
  reviewPeriod: "2023 Q1",
  goals: "Complete project X, Improve customer satisfaction",
  achievements: "Successfully delivered project X ahead of schedule",
  challenges: "Limited resources, tight deadlines",
  skills: "Communication, problem-solving",
  overallRating: 4,
  comments: "John has shown excellent progress this quarter.",
  status: "completed",
  createdAt: "2023-03-31T00:00:00.000Z",
  updatedAt: "2023-04-05T00:00:00.000Z",
};

function PerformanceReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use mock data instead of Redux state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const review = id !== "new" ? mockReview : null;
  const [formData, setFormData] = useState({
    goals: "",
    achievements: "",
    challenges: "",
    skills: "",
    overallRating: 0,
    comments: "",
  });

  useEffect(() => {
    if (id !== "new") {
      // In a real app, we would fetch a specific review by ID
      // dispatch(fetchPerformances());

      // For now, we're using mock data
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (review) {
      setFormData(review);
    }
  }, [review]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      overallRating: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // In a real app, we would dispatch an action to update the review
    //
    // In a real app, we would dispatch an action to update the review
    // const result = await dispatch(updatePerformanceReview({ id, ...formData }));

    // For now, we'll just simulate a successful submission
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      // Navigate back to the performance list
      navigate("/performance");
    }, 1000);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {id === "new" ? "New Performance Review" : "Performance Review"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Goals and Objectives
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="Enter goals and objectives..."
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Achievements
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Enter achievements..."
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Challenges
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                placeholder="Enter challenges faced..."
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills Assessment
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Enter skills assessment..."
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Overall Rating
              </Typography>
              <Rating
                name="overallRating"
                value={formData.overallRating}
                onChange={handleRatingChange}
                size="large"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Comments
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Enter additional comments..."
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/performance")}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Saving..." : "Save Review"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default PerformanceReview;
