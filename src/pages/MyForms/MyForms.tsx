import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { deleteForm, setSelectedForm } from "../../redux/formSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
  Fade,
} from "@mui/material";
import {
  Assignment,
  Visibility,
  Delete,
  Add,
  Schedule,
} from "@mui/icons-material";

export default function MyForms() {
  const forms = useSelector((state: RootState) => state.form.forms);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePreview = (form: any) => {
    dispatch(setSelectedForm(form));
    navigate("/preview");
  };

  return (
    <Box 
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            background: 'linear-gradient(45deg, #667eea, #764ba2)'
          }}
        >
          <Assignment sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          My Saved Forms
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage and view your created forms
        </Typography>
      </Paper>

      {forms.length === 0 && (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Assignment sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" mb={2}>
            No forms found
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Create your first form to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/create")}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
            }}
          >
            Create New Form
          </Button>
        </Paper>
      )}

      {forms.map((form, i) => (
        <Fade in={true} key={i} timeout={300 + (i * 100)}>
          <Card 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2} flex={1}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)'
                    }}
                  >
                    <Assignment />
                  </Avatar>
                  <Box flex={1}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#2c3e50',
                        mb: 0.5 
                      }}
                    >
                      {form.formName}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Schedule sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="body2" color="textSecondary">
                        Created: {new Date(form.createdAt).toLocaleDateString()} at {new Date(form.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${form.fields?.length || 0} fields`}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #4caf50, #45a049)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
                
                <Box display="flex" gap={1} ml={2}>
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(form)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => dispatch(deleteForm(form.formName))}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#ffebee',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      ))}

      {forms.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate("/create")}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
              }
            }}
          >
            Create New Form
          </Button>
        </Box>
      )}
    </Box>
  );
}