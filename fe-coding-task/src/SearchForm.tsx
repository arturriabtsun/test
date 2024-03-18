import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { Data } from "./App";
import History from './History'

export interface FormData {
  from: string;
  to: string;
  type: string;
}
interface SearchEntry extends FormData {}

const fetchData = async (props: FormData) => {
  const response = await axios.post(
    "https://data.ssb.no/api/v0/no/table/07241",
    {
      query: [
        {
          code: "Boligtype",
          selection: {
            filter: "item",
            values: [props.type],
          },
        },
        {
          code: "ContentsCode",
          selection: {
            filter: "item",
            values: ["KvPris"],
          },
        },
        {
          code: "Tid",
          selection: {
            filter: "item",
            values: [props.from, props.to],
          },
        },
      ],
      response: {
        format: "json-stat2",
      },
    }
  );
  return response;
};

const SearchForm: React.FC<{
  setData: React.Dispatch<React.SetStateAction<Data>>;
}> = ({ setData }) => {
  const {
    register,
    handleSubmit, setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchEntry, setSearchEntry] = useState<SearchEntry | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set form values from URL params
    const searchParams = new URLSearchParams(window.location.search);
    setValue("from", searchParams.get("from") || "");
    setValue("to", searchParams.get("to") || "");
    setValue("type", searchParams.get("type") || "");
  }, [setValue]);

  const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
    try {
      const response = await fetchData(formData);
      const tid = Object.entries(response.data.dimension.Tid.category.index);
      const formattedData = response.data.value.map(
        (price: number, index: number) => ({
          name: tid.filter((item) => item[1] === index)[0]?.[0],
          value: price,
        })
      );
      setData({ loading: false, error: "", chartData: formattedData });
      const newEntry: SearchEntry = {
        type: formData.type,
        from: formData.from,
        to: formData.to
      };
  
      setSearchEntry(newEntry);
      setOpenDialog(true);
    } catch (error) {
      setData({
        loading: false,
        error: "An error occured",
        chartData: [],
      });
    }

    navigate({
      pathname: "/",
      search: `from=${encodeURIComponent(
        formData.from
      )}&to=${encodeURIComponent(formData.to)}&type=${encodeURIComponent(
        formData.type
      )}`,
    });
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <TextField
          {...register("from", {
            required: true,
            validate: (value) =>
              Number(value.substring(0, 4)) >= 2009 ||
              "Value must be greater than or equal to 2009K1",
          })}
          label="From (e.g., 2009K1)"
          variant="outlined"
          type="text"
          error={!!errors.from}
          helperText={errors.from && errors.from.message}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <TextField
          {...register("to", { required: true })}
          label="To (e.g., 2022K4)"
          variant="outlined"
          type="text"
          error={!!errors.to}
          helperText={errors.to && errors.to.message}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="type-select-label">Type</InputLabel>
        <Select
          {...register("type", { required: true })}
          id="type-select"
          labelId="type-select-label"
          defaultValue="00"
          error={!!errors.type}
        >
          <MenuItem value="00">Boliger i alt</MenuItem>
          <MenuItem value="01">Eneboliger</MenuItem>
          <MenuItem value="02">Småhus</MenuItem>
          <MenuItem value="03">Blokkleiligheter</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" type="submit">
        Search
      </Button>
    </form>
    <History openDialog={openDialog} setOpenDialog={setOpenDialog} searchEntry={searchEntry}/>
    </>
  );
};

export default SearchForm;
