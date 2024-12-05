import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel, Alert, Typography, CircularProgress } from "@mui/material";
import axios from 'axios';

// Sample preset data for testing
const userPresets = [
  { id: 1, name: "Preset 1", action: "Buy", quantity: 10, price: 150.5 },
  { id: 2, name: "Preset 2", action: "Sell", quantity: 5, price: 2750.1 },
];

const TradeDialog = ({ open, onClose, stock }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [tradeStatus, setTradeStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle order placement
  const handleOnOrder = async () => {
    if (!selectedPreset) {
      setTradeStatus("No preset selected. Please choose a preset.");
      return;
    }

    const preset = userPresets.find((p) => p.id === selectedPreset);
    alert("Order placed successfully");

    const data = {
      stockId: stock.scriptId._id,
      orderType: preset.action,
      priceType: "Market", 
      productType: "MIS",
      qty: preset.quantity,
      price: preset.price,
      userId: JSON.parse(localStorage.getItem('cmUser')).userid,
      stockPrice: stock.scriptId.lastPrice,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/stock/${preset.action.toLowerCase()}`,
        data
      );
      setLoading(false);
      if (response.status === 200) {
        setTradeStatus(`Order completed: ${preset.action} ${preset.quantity} of ${stock.scriptId.symbol}`);
      } else {
        setTradeStatus("Order placement failed.");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setTradeStatus("An error occurred while placing the order.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Trade Preset</DialogTitle>
      <DialogContent>
        {userPresets.length === 0 ? (
          <Alert severity="info">
            You don't have any presets. Please create a preset in the config page.
          </Alert>
        ) : (
          <FormControl fullWidth>
            <InputLabel id="preset-select-label">Select Preset</InputLabel>
            <Select
              labelId="preset-select-label"
              value={selectedPreset}
              label="Select Preset"
              onChange={(e) => setSelectedPreset(e.target.value)}
            >
              {userPresets.map((preset) => (
                <MenuItem key={preset.id} value={preset.id}>
                  {preset.name} - {preset.action} - Qty: {preset.quantity} @ ${preset.price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      
      <DialogActions sx={{ padding: "16px" }}>
        <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
        <Button onClick={handleOnOrder} color="primary" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Execute Order"}
        </Button>
      </DialogActions>

      {tradeStatus && (
        <Alert severity={tradeStatus.includes("completed") ? "success" : "error"} sx={{ m: 2 }}>
          {tradeStatus}
        </Alert>
      )}
    </Dialog>
  );
};

export default TradeDialog;
