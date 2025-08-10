import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addForm, setSelectedForm } from "../../redux/formSlice";
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Chip,
  Divider,
  Paper,
  Tooltip,
  Fade,
} from "@mui/material";
import { 
  Delete, 
  Add, 
  DragIndicator,
  Settings,
  Home,
  Folder
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PreviewForm from "../PreviewForm/PreviewForm";

export default function CreateForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<any[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // Auto-update preview original 
  useEffect(() => {
    dispatch(setSelectedForm({ formName, createdAt: new Date().toISOString(), fields }));
  }, [fields, formName, dispatch]);

  const fieldTypes = [
    { type: "text", label: "Text", color: "#1976d2" },
    { type: "number", label: "Number", color: "#388e3c" },
    { type: "textarea", label: "Textarea", color: "#f57c00" },
    { type: "select", label: "Select", color: "#7b1fa2" },
    { type: "radio", label: "Radio", color: "#d32f2f" },
    { type: "checkbox", label: "Checkbox", color: "#0288d1" },
    { type: "date", label: "Date", color: "#5d4037" },
  ];

  const addField = (type: string) => {
    let newField: any = {
      id: Date.now(),
      type,
      label: "",
      required: false,
      defaultValue: "",
      validation: { minLength: "", maxLength: "", email: false, password: false },
      derived: false,
      parentIds: [],
      operation: "",
    };

    if (type === "select" || type === "radio" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2"];
    }
    if (type === "number") {
      newField.min = "";
      newField.max = "";
    }
    setFields((prev) => [...prev, newField]);
  };

  const updateField = (id: number, key: string, value: any) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const updateOption = (id: number, idx: number, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, options: f.options.map((opt: string, i: number) => (i === idx ? value : opt)) }
          : f
      )
    );
  };

  const addOption = (id: number) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, options: [...f.options, "New Option"] } : f))
    );
  };

  const removeOption = (id: number, idx: number) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, options: f.options.filter((_: any, i: number) => i !== idx) } : f
      )
    );
  };

  const deleteField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSaveConfirm = () => {
    if (!formName.trim()) {
      alert("Form name is required");
      return;
    }
    setShowConfirm(true);
  };

  const handleSave = () => {
    const formData = {
      formName,
      createdAt: new Date().toISOString(),
      fields,
    };
    dispatch(addForm(formData));
    dispatch(setSelectedForm(formData));
    setShowConfirm(false);
    alert("Form saved!");
  };

  return (
    <Box 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Enhanced Top Bar */}
      <Paper 
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 0,
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Settings sx={{ color: '#667eea' }} />
          Form Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            startIcon={<Home />}
            variant="outlined" 
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Home
          </Button>
          <Button 
            startIcon={<Folder />}
            variant="outlined" 
            onClick={() => navigate("/myforms")}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            My Forms
          </Button>
        </Box>
      </Paper>

      <Box flex={1} display="flex">
        {/* Enhanced Left Sidebar */}
        <Paper
          elevation={4}
          sx={{
            width: "240px",
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            p: 3,
            borderRadius: 0,
            borderRight: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Typography 
            variant="h6" 
            mb={3} 
            sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              textAlign: 'center',
              borderBottom: '2px solid #e0e0e0',
              pb: 1
            }}
          >
            Field Types
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {fieldTypes.map((fieldType) => (
              <Tooltip key={fieldType.type} title={`Add ${fieldType.label} field`} placement="right">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => addField(fieldType.type)}
                  startIcon={<Add />}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${fieldType.color}, ${fieldType.color}dd)`,
                    boxShadow: `0 4px 8px ${fieldType.color}40`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 12px ${fieldType.color}60`,
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {fieldType.label}
                </Button>
              </Tooltip>
            ))}
          </Box>
        </Paper>

        {/* Enhanced Middle - Form Builder */}
        <Box 
          flex={1} 
          p={4} 
          overflow="auto"
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography 
            variant="h4" 
            mb={4} 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Design Your Form
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <TextField 
              label="Form Name" 
              fullWidth 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Paper>

          {fields.map((field, index) => (
            <Fade in={true} key={field.id}>
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
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Field Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <DragIndicator sx={{ color: '#bbb', cursor: 'grab' }} />
                      <Chip 
                        label={`#${index + 1} ${field.type.toUpperCase()}`}
                        size="small"
                        sx={{
                          background: fieldTypes.find(ft => ft.type === field.type)?.color || '#666',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Tooltip title="Delete Field">
                      <IconButton 
                        color="error" 
                        onClick={() => deleteField(field.id)}
                        sx={{
                          '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: '#ffebee'
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Field Configuration */}
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
                    <TextField 
                      label="Field Label" 
                      value={field.label} 
                      onChange={(e) => updateField(field.id, "label", e.target.value)}
                      sx={{ gridColumn: '1 / -1' }}
                    />
                  </Box>

                  <Box display="flex" gap={2} mb={2}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          checked={field.required} 
                          onChange={(e) => updateField(field.id, "required", e.target.checked)} 
                        />
                      } 
                      label="Required" 
                    />
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          checked={field.derived} 
                          onChange={(e) => updateField(field.id, "derived", e.target.checked)} 
                        />
                      } 
                      label="Derived Field" 
                    />
                  </Box>

                  {/* Default Value */}
                  {field.type !== "checkbox" && (
                    <TextField 
                      label="Default Value" 
                      fullWidth 
                      sx={{ mb: 2 }} 
                      value={field.defaultValue} 
                      onChange={(e) => updateField(field.id, "defaultValue", e.target.value)} 
                    />
                  )}

                  {/* Validation Rules */}
                  {(field.type === "text" || field.type === "textarea") && (
                    <Box>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Validation Rules" size="small" />
                      </Divider>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
                        <TextField 
                          label="Min Length" 
                          type="number" 
                          value={field.validation.minLength} 
                          onChange={(e) => updateField(field.id, "validation", { ...field.validation, minLength: e.target.value })} 
                        />
                        <TextField 
                          label="Max Length" 
                          type="number" 
                          value={field.validation.maxLength} 
                          onChange={(e) => updateField(field.id, "validation", { ...field.validation, maxLength: e.target.value })} 
                        />
                      </Box>
                      <Box display="flex" gap={2}>
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              checked={field.validation.email} 
                              onChange={(e) => updateField(field.id, "validation", { ...field.validation, email: e.target.checked })} 
                            />
                          } 
                          label="Email Format" 
                        />
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              checked={field.validation.password} 
                              onChange={(e) => updateField(field.id, "validation", { ...field.validation, password: e.target.checked })} 
                            />
                          } 
                          label="Password Rule" 
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Number Field Min/Max Digits */}
                  {field.type === "number" && (
                    <Box>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Number Constraints" size="small" />
                      </Divider>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <TextField 
                          label="Minimum Digits" 
                          type="number" 
                          value={field.min} 
                          onChange={(e) => updateField(field.id, "min", e.target.value)} 
                        />
                        <TextField 
                          label="Maximum Digits" 
                          type="number" 
                          value={field.max} 
                          onChange={(e) => updateField(field.id, "max", e.target.value)} 
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Options for Select/Radio/Checkbox */}
                  {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                    <Box>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Options" size="small" />
                      </Divider>
                      {field.options.map((opt: string, idx: number) => (
                        <Box key={idx} display="flex" gap={1} mb={1}>
                          <TextField 
                            label={`Option ${idx + 1}`} 
                            fullWidth 
                            value={opt} 
                            onChange={(e) => updateOption(field.id, idx, e.target.value)} 
                          />
                          <IconButton 
                            color="error" 
                            onClick={() => removeOption(field.id, idx)}
                            disabled={field.options.length <= 1}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                      <Button 
                        startIcon={<Add />}
                        onClick={() => addOption(field.id)}
                        sx={{ mt: 1 }}
                      >
                        Add Option
                      </Button>
                    </Box>
                  )}

                  {/* Date Field Default */}
                  {field.type === "date" && (
                    <TextField 
                      type="date" 
                      fullWidth 
                      label="Default Date"
                      InputLabelProps={{ shrink: true }}
                      sx={{ mt: 2 }} 
                      value={field.defaultValue} 
                      onChange={(e) => updateField(field.id, "defaultValue", e.target.value)} 
                    />
                  )}

                  {/* Derived Field Controls */}
                  {field.derived && (
                    <Box>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Derived Field Configuration" size="small" color="secondary" />
                      </Divider>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <TextField 
                          select 
                          fullWidth 
                          label="Parent Fields" 
                          SelectProps={{ multiple: true }} 
                          value={field.parentIds} 
                          onChange={(e) => updateField(field.id, "parentIds", e.target.value)}
                        >
                          {fields.filter((f) => f.id !== field.id).map((f) => (
                            <MenuItem key={f.id} value={f.id}>
                              {f.label || `${f.type} field`}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField 
                          select 
                          fullWidth 
                          label="Operation" 
                          value={field.operation} 
                          onChange={(e) => updateField(field.id, "operation", e.target.value)}
                        >
                          <MenuItem value="sum">Sum</MenuItem>
                          <MenuItem value="subtract">Subtract</MenuItem>
                          <MenuItem value="concat">Concatenate</MenuItem>
                          <MenuItem value="age">Age from Date</MenuItem>
                        </TextField>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          ))}

          {fields.length === 0 && (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px dashed rgba(255, 255, 255, 0.3)'
              }}
            >
              <Typography variant="h6" color="white" mb={2}>
                No fields added yet
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Use the sidebar to add form fields
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Enhanced Right - Live Preview with Save Button */}
        <Paper
          elevation={4}
          sx={{
            width: "380px",
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 0,
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'center'
              }}
            >
              Live Preview
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, p: 3 }}>
            <PreviewForm isBuilderMode={true} />
          </Box>

          {/* Save Button Fixed at Bottom */}
          {fields.length > 0 && formName.trim() && (
            <Box 
              sx={{ 
                p: 3, 
                borderTop: '1px solid #e0e0e0',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <Button 
                fullWidth
                variant="contained" 
                size="large"
                onClick={handleSaveConfirm}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #4caf50, #45a049)',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)'
                  }
                }}
              >
                💾 Save Form
              </Button>
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  mt: 1, 
                  textAlign: 'center',
                  color: 'text.secondary' 
                }}
              >
                Ready to save your form
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Enhanced Confirm Dialog */}
      <Dialog 
        open={showConfirm} 
        onClose={() => setShowConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
          Confirm Save
        </DialogTitle>
        <DialogContent>
          <Typography textAlign="center">
            Are you sure you want to save this form as "<strong>{formName}</strong>"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button 
            onClick={() => setShowConfirm(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="success"
            sx={{ borderRadius: 2 }}
          >
            Yes, Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}