import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DropzoneComponent from "../DropZoneComponent/DropZoneComponent";
import { CsvToHtmlTable } from 'react-csv-to-table';
import ServiceCall from "../../Service/ServiceCall";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Developed by Team BASH (Bhavya, Schezeen, Ankit)
      <br />
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(5, 0, 3),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },

  csvDiv: {
    marginLeft: "40%"
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
  },
  search: {
    margin: theme.spacing(1),
    width: 600,
  },

  button: {
    margin: 5
  }
}));

export default function LandingPage() {
  const classes = useStyles();
  const [files, setFiles] = useState({});
  const [csvData, setCsvData] = useState("");
  const [showCSVModal, setShowCSVModal] = useState(false);

function returnCSVFiles(){
  ServiceCall.returnFile().then((response)=>{
    console.log(response.data)
    setFiles(response.data)
  })
}



function showData(csv_file_path){
  setShowCSVModal(true);
  console.log("CSV: ", csv_file_path)
  ServiceCall.getCSVFileData(csv_file_path).then((response)=>{
    setCsvData(response.data)
   // alert(response.data)
  })
  // ServiceCall.triggerDTale(csv_file_path).then((response)=>{
  //   alert(response.data);
  // })
}

  const [pathValue, setValue] = useState("");
  const [resEs, setResEs] = useState([]);

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 3,
      }}
    />
  );

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar color="default" position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            EY - Simplified Intelligent Data Extraction
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              SIDE
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              <i>Simplified Intelligent Data Sourcing</i>
            </Typography>
            <DropzoneComponent />
          </Container>
        </div>
        <Button variant="contained" style={{backgroundColor:"#ffe600"}} 
        onClick={(e) => {
            e.preventDefault();
            returnCSVFiles();
          }}
        >
        Get Stored Tables 
    </Button> 

    <Button variant="contained" style={{backgroundColor:"#ffe600"}} onClick={()=>setShowCSVModal(false)}>clear</Button> 

    <div>
      {Object.entries(files).map(([key, value]) => {
        return (
          <Button variant="contained" style={{backgroundColor:"#ffe600"}} onClick={()=>showData({value})}>{key}</Button> 
        )
    })}
    </div>


    
    <div className={classes.csvDiv}>
      {showCSVModal? <CsvToHtmlTable
        data={csvData}
        csvDelimiter=","
        tableClassName="table table-striped table-hover"
      />: <p></p>}
    </div>


        <Grid item>
          <br /> <br /> <br />
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: "#999999", color: "#FFFFFF" }}
              // onClick={() => handleSubmit("business")}
            >
              PDF - Data Source
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              style={{ backgroundColor: "#999999", color: "#FFFFFF" }}
              // onClick={() => handleSubmit("tech")}
            >
              Excel / CSV / Images
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              style={{ backgroundColor: "#999999", color: "#FFFFFF" }}
              // onClick={() => handleSubmit("sport")}
            >
              Browser Extension
            </Button>
            <Typography
              variant="h7"
              align="center"
              color="textSecondary"
              paragraph
            >
              <br />
              <b>
                <i>*Please select any one of the category</i>
              </b>
            </Typography>
          </Grid>
          <br />
          <Button
            variant="contained"
            style={{ backgroundColor: "#333333", color: "#FFFFFF" }}
            // onClick={() => handleSubmit("politics")}
          >
            Create Dashboard
          </Button>
          <br />
        </Grid>
        <br /> <br />
        <ColoredLine color="black" />
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          SIDE
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          BASH
        </Typography>
        <Copyright />
      </footer>

      
      {/* <CsvToHtmlTable
        data={sampleData}
        csvDelimiter=","
        tableClassName="table table-striped table-hover"
      /> */}



    </React.Fragment>
  );
}
