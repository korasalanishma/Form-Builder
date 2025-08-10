import "./Home.css";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

return (
  <Box className="home-container">
    <Typography 
      variant="h1" 
      className="home-title"
      sx={{
        fontSize: "2.5rem", 
        fontWeight: "bold",
        
        marginBottom: "2.5rem", 
        marginTop: "2rem",    
        color: "#34479cff",
        textAlign: "center"
      }}
    >
      Form Builder
    </Typography>

    <div className="button-group">
      <Button className="home-btn" onClick={() => navigate("/create")}>
        Create
      </Button>
      <Button className="home-btn" onClick={() => navigate("/myforms")}>
        My Forms
      </Button>
    </div>
  </Box>
);

  
}
