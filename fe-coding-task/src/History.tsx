import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { FormData } from "./SearchForm";

interface SearchEntry extends FormData {}

const History: React.FC<{
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  searchEntry: SearchEntry | null;
}> = ({ openDialog, setOpenDialog, searchEntry }) => {
  const [searchHistory, setSearchHistory] = useState<SearchEntry[]>([]);

  useEffect(() => {
    const storedHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    ) as SearchEntry[];
    setSearchHistory(storedHistory);
  }, []);

  const handleCloseDialog = (save: boolean) => {
    setOpenDialog(false);
    if (save && searchEntry) {
      const newHistory = [...searchHistory, searchEntry];
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  };
  return (
    <>
      <Dialog open={openDialog} onClose={() => handleCloseDialog(false)}>
        <DialogTitle>Save Search Entry</DialogTitle>
        <DialogContent>
          Do you want to save this search entry to your history?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => handleCloseDialog(true)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h5" gutterBottom>
        Search History
      </Typography>
      <ul>
        {searchHistory.map((entry, index) => (
          <li key={index}>
            {`Type: ${entry.type}, From: ${entry.from}, To: ${entry.to}`}
          </li>
        ))}
      </ul>
    </>
  );
};
export default History;
