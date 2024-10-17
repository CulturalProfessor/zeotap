import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, ThemeProvider, createTheme, CssBaseline, MenuItem, Select } from '@mui/material';

const BACKEND_URL = 'http://localhost:3000';

function RuleEngine() {
  const [ruleString, setRuleString] = useState('(age > 30 AND department = "Sales") OR (salary > 50000 AND experience > 5)');
  const [data, setData] = useState('{"age": 35, "department": "Sales", "salary": 60000, "experience": 7}');
  const [result, setResult] = useState(null);
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      const res = await fetch(`${BACKEND_URL}/rules`);
      const data = await res.json();
      setRules(data);
    };
    fetchRules();
  }, []);

  const createRule = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/create_rule`, {
        method: 'POST',
        body: JSON.stringify({ ruleString }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error creating rule: ${errorData.error}`);
        return;
      }
  
      const data = await res.json();
      console.log('Rule created:', data);
      setRules(prev => [...prev, data.rule]);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const updateRule = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/update_rule`, {
        method: 'PUT',
        body: JSON.stringify({ ruleId: selectedRule, ruleString }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error updating rule: ${errorData.error}`);
        return;
      }
  
      const data = await res.json();
      console.log('Rule updated:', data);
      setRules((prev) => prev.map((rule) => (rule._id === selectedRule ? data.rule : rule)));
  
      setIsEditMode(false);
      setRuleString('');
      setSelectedRule('');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const evaluateRule = async () => {
    if (!selectedRule) {
      alert('Please select a rule to evaluate.');
      return;
    }
    const res = await fetch(`${BACKEND_URL}/evaluate_rule`, {
      method: 'POST',
      body: JSON.stringify({ ruleId: selectedRule, data: JSON.parse(data) }),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    setResult(result.eligible);
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  // Handle selecting a rule to modify
  const handleSelectRule = (ruleId) => {
    const ruleToEdit = rules.find((rule) => rule._id === ruleId);
    if (ruleToEdit) {
      setSelectedRule(ruleId);
      setRuleString(ruleToEdit.ruleString);
      setIsEditMode(true);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 3, 
          padding: 4,
          maxWidth: 600,
          margin: 'auto',
          mt: 4 
        }}
        component={Paper}
        elevation={3}
      >
        <Typography variant="h4" gutterBottom>
          Rule Engine
        </Typography>

        <TextField
          label="Rule String"
          variant="outlined"
          fullWidth
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          placeholder="Enter rule string"
        />

        {!isEditMode ? (
          <Button variant="contained" color="primary" onClick={createRule} fullWidth disabled={!ruleString}>
            Create Rule
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={updateRule} fullWidth>
            Update Rule
          </Button>
        )}

        <Select
          value={selectedRule}
          onChange={(e) => handleSelectRule(e.target.value)}
          fullWidth
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a rule to modify or evaluate
          </MenuItem>
          {rules.map((rule) => (
            <MenuItem key={rule._id} value={rule._id}>
              {rule.ruleString}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Test Data"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 7}'
        />
        <Button variant="contained" color="secondary" onClick={evaluateRule} fullWidth>
          Evaluate Rule
        </Button>

        {result !== null && (
          <Typography variant="h6" color={result ? 'green' : 'red'}>
            Eligibility: {result ? 'Yes' : 'No'}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default RuleEngine;
