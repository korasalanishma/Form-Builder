import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  RadioGroup,
  Radio,
  Button,
  Paper,
  Alert,
  FormGroup,
} from "@mui/material";
import {
  Send,
  Assignment,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

interface PreviewFormProps {
  isBuilderMode?: boolean;
}

export default function PreviewForm({ isBuilderMode = false }: PreviewFormProps) {
  const selectedForm = useSelector((state: RootState) => state.form.selectedForm);
  const [values, setValues] = useState<Record<number, any>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Set default values when form loads
  useEffect(() => {
    if (selectedForm) {
      const defaults: Record<number, any> = {};
      selectedForm.fields.forEach((field) => {
        defaults[field.id] = field.defaultValue || (field.type === "checkbox" ? false : "");
      });
      setValues(defaults);
    }
  }, [selectedForm]);

  // Derived fields auto-update
  useEffect(() => {
    if (!selectedForm) return;
    let updatedValues = { ...values };
    let hasChanges = false;
    
    selectedForm.fields.forEach((field) => {
      if (field.derived && field.parentIds?.length && field.operation) {
        const parentVals = field.parentIds.map((id: number) => updatedValues[id]);
        let newValue;
        
        switch (field.operation) {
          case "sum":
            newValue = parentVals.reduce((a, b) => Number(a || 0) + Number(b || 0), 0);
            break;
          case "subtract":
            newValue = parentVals.reduce((a, b) => Number(a || 0) - Number(b || 0));
            break;
          case "concat":
            newValue = parentVals.filter(v => v).join(" ");
            break;
          case "age":
            if (parentVals[0]) {
              const dob = new Date(parentVals[0]);
              newValue = new Date().getFullYear() - dob.getFullYear();
            }
            break;
          default:
            newValue = updatedValues[field.id];
        }
        
        if (updatedValues[field.id] !== newValue) {
          updatedValues[field.id] = newValue;
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      setValues(updatedValues);
    }
  }, [values, selectedForm]);

  if (!selectedForm || !selectedForm.fields?.length) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          background: '#f5f5f5',
          border: '2px dashed #ddd'
        }}
      >
        <Assignment sx={{ fontSize: 40, color: '#bbb', mb: 1 }} />
        <Typography variant="body1" color="textSecondary">
          {isBuilderMode ? "Add fields to see preview" : "No form selected"}
        </Typography>
      </Paper>
    );
  }

  const validateField = (field: any, value: any): string => {
    if (field.required && (!value || value === "" || (field.type === "checkbox" && !value))) {
      return "This field is required";
    }
    if (field.validation?.minLength && value && value.length < Number(field.validation.minLength)) {
      return `Minimum length is ${field.validation.minLength}`;
    }
    if (field.validation?.maxLength && value && value.length > Number(field.validation.maxLength)) {
      return `Maximum length is ${field.validation.maxLength}`;
    }
    if (field.validation?.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    }
    if (field.validation?.password && value) {
      const passRegex = /^(?=.*[0-9]).{8,}$/;
      if (!passRegex.test(value)) {
        return "Password must be at least 8 characters and contain a number";
      }
    }
    if (field.type === "number" && value) {
      // Count digits in the number (removing any non-digit characters)
      const digitString = value.toString().replace(/[^0-9]/g, '');
      const digitCount = digitString.length;
      
      if (field.min && digitCount < Number(field.min)) {
        return `Minimum digits is ${field.min}`;
      }
      if (field.max && digitCount > Number(field.max)) {
        return `Maximum digits is ${field.max}`;
      }
    }
    return "";
  };

  const handleChange = (id: number, value: any, field: any) => {
    const updated = { ...values, [id]: value };
    setValues(updated);
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<number, string> = {};
    let hasErrors = false;

    selectedForm.fields.forEach((field) => {
      const error = validateField(field, values[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      if (isBuilderMode) {
        alert("Form validation passed! (This is preview mode - data not saved)");
      } else {
        alert("Form submitted successfully!");
        // In real app, you would submit data here
      }
    } else {
      alert("Please fix the validation errors before submitting.");
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        background: 'white'
      }}
    >
      {/* Form Header */}
      <Box 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {selectedForm.formName || "Form Preview"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {selectedForm.fields?.length || 0} fields
        </Typography>
      </Box>

      {/* Form Content */}
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        {selectedForm.fields?.map((field: any) => (
          <Box key={field.id} sx={{ mb: 3 }}>
            {/* Text Field */}
            {field.type === "text" && (
              <TextField
                fullWidth
                label={field.label || "Text Field"}
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value, field)}
                required={field.required}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                disabled={field.derived}
                type={field.validation?.password ? "password" : "text"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: field.derived ? '#f0f8f0' : 'white'
                  }
                }}
              />
            )}

            {/* Number Field */}
            {field.type === "number" && (
              <TextField
                fullWidth
                type="number"
                label={field.label || "Number Field"}
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value, field)}
                required={field.required}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                disabled={field.derived}
                inputProps={{
                  min: field.min || undefined,
                  max: field.max || undefined
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: field.derived ? '#f0f8f0' : 'white'
                  }
                }}
              />
            )}

            {/* Textarea Field */}
            {field.type === "textarea" && (
              <TextField
                fullWidth
                multiline
                minRows={3}
                label={field.label || "Textarea Field"}
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value, field)}
                required={field.required}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                disabled={field.derived}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: field.derived ? '#f0f8f0' : 'white'
                  }
                }}
              />
            )}

            {/* Select Field */}
            {field.type === "select" && (
              <TextField
                select
                fullWidth
                label={field.label || "Select Field"}
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value, field)}
                required={field.required}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                disabled={field.derived}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: field.derived ? '#f0f8f0' : 'white'
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                {(field.options || []).map((opt: string, idx: number) => (
                  <MenuItem key={idx} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Radio Field */}
            {field.type === "radio" && (
              <Box>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ mb: 1 }}
                >
                  {field.label || "Radio Field"} {field.required && "*"}
                </Typography>
                <RadioGroup
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value, field)}
                >
                  {(field.options || []).map((opt: string, idx: number) => (
                    <FormControlLabel
                      key={idx}
                      value={opt}
                      control={<Radio disabled={field.derived} />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
                {errors[field.id] && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors[field.id]}
                  </Alert>
                )}
              </Box>
            )}

            {/* Checkbox Field */}
            {field.type === "checkbox" && field.options ? (
              <Box>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ mb: 1 }}
                >
                  {field.label || "Checkbox Field"} {field.required && "*"}
                </Typography>
                <FormGroup>
                  {(field.options || []).map((opt: string, idx: number) => (
                    <FormControlLabel
                      key={idx}
                      control={
                        <Checkbox
                          checked={Array.isArray(values[field.id]) ? values[field.id].includes(opt) : false}
                          onChange={(e) => {
                            const currentValues = Array.isArray(values[field.id]) ? values[field.id] : [];
                            const newValues = e.target.checked
                              ? [...currentValues, opt]
                              : currentValues.filter((v: string) => v !== opt);
                            handleChange(field.id, newValues, field);
                          }}
                          disabled={field.derived}
                        />
                      }
                      label={opt}
                    />
                  ))}
                </FormGroup>
                {errors[field.id] && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors[field.id]}
                  </Alert>
                )}
              </Box>
            ) : field.type === "checkbox" && (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!values[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.checked, field)}
                      disabled={field.derived}
                    />
                  }
                  label={`${field.label || "Checkbox Field"} ${field.required ? "*" : ""}`}
                />
                {errors[field.id] && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors[field.id]}
                  </Alert>
                )}
              </Box>
            )}

            {/* Date Field */}
            {field.type === "date" && (
              <TextField
                fullWidth
                type="date"
                label={field.label || "Date Field"}
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value, field)}
                required={field.required}
                InputLabelProps={{ shrink: true }}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                disabled={field.derived}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: field.derived ? '#f0f8f0' : 'white'
                  }
                }}
              />
            )}
          </Box>
        ))}

      

        {/* Builder Mode Message */}
        {isBuilderMode && selectedForm.fields?.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ 
              p: 2, 
              background: '#f5f5f5', 
              borderRadius: 2,
              fontStyle: 'italic'
            }}>
              🔍 Preview Mode - Use the Save button below to save your form
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}