import React, { useState } from "react";
import { TextField, Button, Box, Typography, Card, CardContent, IconButton, Grid } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const PresetConfig = () => {
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [scriptName, setScriptName] = useState("");
  const [action, setAction] = useState(""); // Buy or Sell
  const [orderType, setOrderType] = useState(""); // Market, Limit
  const [quantity, setQuantity] = useState("");
  const [totalRiskOnCapital, setTotalRiskOnCapital] = useState("");
  const [totalRisk, setTotalRisk] = useState("");
  const [riskRewardRatio, setRiskRewardRatio] = useState("");

  // Function to calculate stopLoss and takeProfit based on riskRewardRatio
  const calculateRiskReward = () => {
    const parsedTotalRisk = parseFloat(totalRisk);
    const parsedQuantity = parseFloat(quantity);
    const parsedRiskRewardRatio = parseFloat(riskRewardRatio);

    if (!isNaN(parsedTotalRisk) && !isNaN(parsedQuantity) && parsedQuantity > 0 && !isNaN(parsedRiskRewardRatio)) {
      const stopLossCalculated = (parsedTotalRisk / parsedQuantity).toFixed(2);
      const takeProfitCalculated = (stopLossCalculated * parsedRiskRewardRatio).toFixed(2);

      return {
        stopLoss: stopLossCalculated,
        takeProfit: takeProfitCalculated,
      };
    }
    return { stopLoss: "", takeProfit: "" };
  };

  const handleAddPreset = () => {
    const { stopLoss, takeProfit } = calculateRiskReward();
    
    const newPreset = {
      presetName,
      scriptName,
      action,
      orderType,
      stopLoss,
      takeProfit,
      quantity,
      totalRiskOnCapital,
      totalRisk,
      riskRewardRatio,
    };
    
    setPresets([...presets, newPreset]);

    // Clear form fields
    setPresetName("");
    setScriptName("");
    setAction("");
    setOrderType("");
    setQuantity("");
    setTotalRiskOnCapital("");
    setTotalRisk("");
    setRiskRewardRatio("");
  };

  const handleDeletePreset = (index) => {
    const updatedPresets = presets.filter((_, i) => i !== index);
    setPresets(updatedPresets);
  };

  const handleExecuteOrder = () => {
    // Show a plain JavaScript alert for order placed successfully
    alert("Order placed successfully!");
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f4f4f9", borderRadius: "8px" }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Create Trading Presets</Typography>
      
      <TextField
        label="Preset Name"
        variant="outlined"
        fullWidth
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Script Name"
        variant="outlined"
        fullWidth
        value={scriptName}
        onChange={(e) => setScriptName(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Action (Buy/Sell)"
        variant="outlined"
        fullWidth
        value={action}
        onChange={(e) => setAction(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Order Type (Market/Limit)"
        variant="outlined"
        fullWidth
        value={orderType}
        onChange={(e) => setOrderType(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Quantity"
        variant="outlined"
        fullWidth
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Total Risk on Capital"
        variant="outlined"
        fullWidth
        value={totalRiskOnCapital}
        onChange={(e) => setTotalRiskOnCapital(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Total Risk"
        variant="outlined"
        fullWidth
        value={totalRisk}
        onChange={(e) => setTotalRisk(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Risk Reward Ratio"
        variant="outlined"
        fullWidth
        value={riskRewardRatio}
        onChange={(e) => setRiskRewardRatio(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddPreset}
        sx={{ marginBottom: 2 }}
      >
        Add Preset
      </Button>

      <Typography variant="h6" sx={{ marginBottom: 2 }}>Your Presets</Typography>
      
      <Grid container spacing={2}>
        {presets.map((preset, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{preset.presetName}</Typography>
                <Typography>Script: {preset.scriptName}</Typography>
                <Typography>Action: {preset.action}</Typography>
                <Typography>Order Type: {preset.orderType}</Typography>
                <Typography>Stop Loss: {preset.stopLoss}</Typography>
                <Typography>Take Profit: {preset.takeProfit}</Typography>
                <Typography>Quantity: {preset.quantity}</Typography>
                <Typography>Total Risk on Capital: {preset.totalRiskOnCapital}</Typography>
                <Typography>Total Risk: {preset.totalRisk}</Typography>
                <Typography>Risk Reward Ratio: {preset.riskRewardRatio}</Typography>

                <IconButton
                  onClick={() => handleDeletePreset(index)}
                  color="secondary"
                  sx={{ marginTop: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PresetConfig;
