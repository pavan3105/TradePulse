import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import StopIcon from '@mui/icons-material/Stop';

const pages = ['Dashboard', 'Orders', 'Positions', 'Account', 'Tools', 'Preset'];

// Predefined presets
const presets = {
  'preset-1': { action: 'buy', quantity: 10, price: 10 },
  'preset-2': { action: 'sell', quantity: 10, price: 5 },
};

// Company name to stock symbol mapping
const companyToSymbol = {
  apple: 'AAPL',
  tesla: 'TSLA',
  google: 'GOOGL',
  microsoft: 'MSFT',
};

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [isListening, setIsListening] = React.useState(false);
  const navigate = useNavigate();

  const { transcript, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Browser does not support speech recognition.</p>;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (page) => {
    const pagePaths = {
      dashboard: '/dashboard',
      orders: '/orders',
      positions: '/positions',
      account: '/account',
      tools: '/tools',
      preset: '/preset',
    };

    const pagePath = pagePaths[page.toLowerCase()];
    if (pagePath) navigate(pagePath);
  };

  const handleLogout = () => {
    localStorage.removeItem('cmUser');
    navigate('/signin', { replace: true });
  };

  const startListening = () => {
    try {
      console.log("Starting Speech Recognition...");
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      setIsListening(true);
  
      SpeechRecognition.onstart = () => {
        console.log("Speech recognition started.");
      };
  
      SpeechRecognition.onresult = (event) => {
        console.log("Speech detected:", event.results[0][0].transcript);
      };
  
      SpeechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
  
      SpeechRecognition.onaudioend = () => {
        console.log("Speech recognition ended.");
      };
  
    } catch (error) {
      console.error("Error starting SpeechRecognition:", error);
      alert("Unable to start voice recognition. Please check permissions or try a different browser.");
    }
  };
  
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);

    if (transcript.trim()) {
      handleCommand(transcript);
      resetTranscript();
    } else {
      alert("No speech detected. Please try again.");
    }
  };

  const normalizeCommand = (command) => {
    return command
      .toLowerCase()
      .replace(/\bpreset\s+one\b/g, "preset-1")
      .replace(/\bpreset\s+two\b/g, "preset-2")
      .replace(/\bpreset\s+\d+/g, (match) => match.replace(" ", "-"));
  };

  const handleCommand = (command) => {
    console.log("Raw command:", command);

    const normalizedCommand = normalizeCommand(command);
    console.log("Normalized command:", normalizedCommand);

    const orderPattern = /place\s+order\s+(preset-\d+)\s+for\s+([a-zA-Z]+)/i;
    const match = normalizedCommand.match(orderPattern);

    if (match) {
      const [_, preset, company] = match;

      if (!presets[preset]) {
        alert(`Preset ${preset} is not defined. Please try again.`);
        return;
      }

      const stockSymbol = companyToSymbol[company.toLowerCase()];
      if (!stockSymbol) {
        alert(`Company "${company}" is not recognized. Please try a valid company name.`);
        return;
      }

      const { action, quantity, price } = presets[preset];
      alert(`Executing ${action.toUpperCase()} ${quantity} shares of ${stockSymbol} at $${price} each.`);
      console.log(`Action: ${action}, Quantity: ${quantity}, Price: ${price}, Stock: ${stockSymbol}`);
    } else {
      alert(
        "Sorry, I couldn't understand the command. Please use the format 'Place order preset one for Apple' or 'Place order preset two for Tesla'."
      );
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontFamily: 'Monoton',
              fontWeight: 500,
              letterSpacing: '.3rem',
              color: '#D43725',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Trade Pulse
          </Typography>

          {/* Mobile Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Menu for Larger Screens */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex', alignItems: 'center' },
              gap: 3,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigate(page)}
                sx={{
                  color: '#000',
                  display: 'block',
                  fontWeight: 500,
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Voice Command Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={startListening}
              variant="contained"
              sx={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                padding: '0.5rem 0.8rem',
                fontSize: '0.85rem',
                '&:hover': {
                  backgroundColor: '#45A049',
                },
                display: isListening ? 'none' : 'inline-flex',
              }}
            >
              Order by Voice
            </Button>
            <IconButton
              onClick={stopListening}
              sx={{
                backgroundColor: '#F44336',
                color: '#fff',
                padding: '0.5rem',
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
                display: isListening ? 'inline-flex' : 'none',
              }}
            >
              <StopIcon />
            </IconButton>

            {/* Info Icon for Speech Format */}
            <Tooltip
              title={
                <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Use the following format for speech commands:<br />
                  <strong>Place order preset one for [company name]</strong><br />
                  <strong>Place order preset two for [company name]</strong>
                </Typography>
              }
              placement="bottom"
              arrow
            >
              <IconButton
                sx={{
                  backgroundColor: '#D43725',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#B12B1F',
                  }}
                }
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Logout Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                backgroundColor: '#D43725',
                color: '#fff',
                borderRadius: '50px',
                padding: '0.5rem 1.5rem',
                fontSize: '0.85rem',
                '&:hover': {
                  backgroundColor: '#B12B1F',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
