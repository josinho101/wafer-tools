import {
  AppBar,
  CssBaseline,
  ThemeProvider,
  Tab,
  Tabs,
} from "@material-ui/core";
import { theme } from "../../theme";
import { useState } from "react";
import { appTabs } from "../../appsettings";
import TabPanel from "../ui/tabpanel";
import WaferArea from "../waferarea";
import CoordinateCorrection from "../coordinatecorrection";
import WaferDetails from "../waferdetails";
import WaferViews from "../waferviews";
import SystemCoordinates from "../systemcoordinates";

const App = () => {
  const [selectedTab, setSelectedTab] = useState(appTabs.systemCoordinates);

  const onTabChanged = (e, selected) => {
    setSelectedTab(selected);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <AppBar position="static">
            <Tabs
              value={selectedTab}
              onChange={onTabChanged}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value={appTabs.waferDetails} label="Wafer Details" />
              <Tab value={appTabs.waferViews} label="Wafer views" />
              <Tab value={appTabs.waferArea} label="Wafer Area" />
              <Tab
                value={appTabs.coordinateCorrection}
                label="Coordinate Correction"
              />
              <Tab
                value={appTabs.systemCoordinates}
                label="System Coordinates"
              />
              {/* <Tab
                value={appTabs.uniqueAndCommonDefects}
                label="Unique and Common defects"
              /> */}
            </Tabs>
            <TabPanel value={selectedTab} index={appTabs.waferDetails}>
              <WaferDetails />
            </TabPanel>
            <TabPanel value={selectedTab} index={appTabs.waferViews}>
              <WaferViews />
            </TabPanel>
            <TabPanel value={selectedTab} index={appTabs.waferArea}>
              <WaferArea />
            </TabPanel>
            <TabPanel value={selectedTab} index={appTabs.coordinateCorrection}>
              <CoordinateCorrection />
            </TabPanel>
            <TabPanel value={selectedTab} index={appTabs.systemCoordinates}>
              <SystemCoordinates />
            </TabPanel>
            {/* <TabPanel
              value={selectedTab}
              index={appTabs.uniqueAndCommonDefects}
            ></TabPanel> */}
          </AppBar>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
