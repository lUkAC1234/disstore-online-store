import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { MapContext } from "./ContextCollection";
import projectConfig from "../../../project.config.json";
import map1 from "assets/images/map1.png";
import map2 from "assets/images/map2.png";
import map3 from "assets/images/map3.png";

export { MapContext };

const { layers, timeline } = projectConfig;

export interface MapContextState {
  lightThemeMap?: boolean;
  darkThemeMap?: boolean;
  sputnikThemeMap?: boolean;
  ndviLayer?: boolean;
  ndviLayerOpacity?: number;
  greenZonesWMSTileLayer?: boolean;
  parksWMSTileLayer?: boolean;
  toshkentMaxallalarWMS?: boolean;
  toshkentChegaraWMS?: boolean;
  maxallaCountWMS?: boolean;
  maxallaCountWMSOpacity?: number;
  treeLocationsWMS?: boolean;
  indicatorIsOn: boolean;
  selectedSrcMap: string;
  range: {
    from: Date;
    to: Date;
    from_pretty: string;
    to_pretty: string;
  };
  selectedTree: GeoJsonTreePointRequested;
  mapAreaPopups: boolean;
  identifyMyLocationIsActive: boolean;
  treeRadius: number;
  treeHeight: number;
  treeThickness: number;
  treeName: string;
  volunteerName: string;
  filteredByVolunteers: boolean;
}

export interface MapContextStateWithActions extends MapContextState {
  updateMapState: <T>(key: keyof MapContextState, value: T) => void;
  toggleBoolState: (key: keyof MapContextState) => void;
  setThemeMap: (key: MapKeys) => void;
  setFromToDate: (
    from: Date,
    to: Date,
    from_pretty: string,
    to_pretty: string,
    callback?: () => void
  ) => void;
  setSelectedTree: (data: GeoJsonTreePointRequested) => void;
  setMapAreaPopups: (value: boolean) => void;
  setIdentifyMyLocation: (value: boolean) => void;
  resetTreeFilters: () => void;
  setFilterVolunteerState: (value: boolean) => void;
}

export interface MapContextProps extends PropsWithChildren {}

class MapContextProvider extends PureComponent<MapContextProps, MapContextState> implements BindMethods {
  state: Readonly<MapContextState> = {
    lightThemeMap: false,
    darkThemeMap: true,
    sputnikThemeMap: false,
    ndviLayer: layers.ndvi.isActive,
    ndviLayerOpacity: layers.ndvi.opacity,
    greenZonesWMSTileLayer: layers["old-trees"],
    parksWMSTileLayer: layers.parks,
    toshkentMaxallalarWMS: layers.maxalla,
    toshkentChegaraWMS: layers.areas,
    treeLocationsWMS: true,
    maxallaCountWMS: layers["areas-opacity"].isActive,
    maxallaCountWMSOpacity: layers["areas-opacity"].opacity,
    selectedSrcMap: map3,
    range: {
      from: new Date(timeline.from),
      to: new Date(),
      from_pretty: null,
      to_pretty: null,
    },
    indicatorIsOn: false,
    selectedTree: null,
    mapAreaPopups: false,
    identifyMyLocationIsActive: false,
    treeRadius: 150,
    treeHeight: 50,
    treeThickness: 45,
    treeName: "",
    volunteerName: "",
    filteredByVolunteers: false,
  };

  static logCount: number = 0;

  defaultValues = {
    treeRadius: 150,
    treeHeight: 50,
    treeThickness: 45,
    treeName: "",
    volunteerName: "",
  }

  methods: BindItem[] = [
    { func: this.updateMapState, context: this },
    { func: this.toggleBoolState, context: this },
    { func: this.setThemeMap, context: this },
    { func: this.setFromToDate, context: this },
    { func: this.setSelectedTree, context: this },
    { func: this.setMapAreaPopups, context: this },
    { func: this.setIdentifyMyLocation, context: this },
    { func: this.resetTreeFilters, context: this },
    { func: this.setFilterVolunteerState, context: this },
  ];

  constructor(props: Readonly<MapContextProps>) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <MapContext.Provider value={{
        ...this.state,
        updateMapState: this.updateMapState,
        toggleBoolState: this.toggleBoolState,
        setThemeMap: this.setThemeMap,
        setFromToDate: this.setFromToDate,
        setSelectedTree: this.setSelectedTree,
        setMapAreaPopups: this.setMapAreaPopups,
        setIdentifyMyLocation: this.setIdentifyMyLocation,
        resetTreeFilters: this.resetTreeFilters,
        setFilterVolunteerState: this.setFilterVolunteerState,
      }}>
        {this.props.children}
      </MapContext.Provider>
    );
  }

  componentDidMount(): void {
    this.checkIndicator();
  }

  componentDidUpdate(prevProps: Readonly<MapContextProps>, prevState: Readonly<MapContextState>): void {
    if (prevState !== this.state) {
      this.checkIndicator();
    }
  }

  updateMapState<T>(key: keyof MapContextState, value: T): void {
    this.setState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  toggleBoolState(key: keyof MapContextState): void {
    this.setState(prevState => {
      if (typeof prevState[key] !== "boolean") return;

      return {
        ...prevState,
        [key]: !prevState[key],
      };
    });
  }

  setIdentifyMyLocation(value: boolean): void {
    this.setState(prevState => ({
      ...prevState,
      identifyMyLocationIsActive: value,
    }));
  }

  setMapAreaPopups(value: boolean): void {
    this.setState(prevState => ({
      ...prevState,
      mapAreaPopups: value,
    }));
  }

  checkIndicator(): void {
    let indicatorIsOn: boolean = false;

    for (const [key, value] of Object.entries(this.state)) {
      if (
        key === "ndviLayer" ||
        key === "greenZonesWMSTileLayer" ||
        key === "parksWMSTileLayer" ||
        key === "toshkentMaxallalarWMS" ||
        key === "toshkentChegaraWMS" ||
        key === "maxallaCountWMS" ||
        key === "treeLocationsWMS" &&
        typeof value === "boolean"
      ) {
        if (value) {
          indicatorIsOn = true;
        }
      }
    }

    this.setState(prevState => ({
      ...prevState,
      indicatorIsOn,
    }));
  }

  setFromToDate(from: Date, to: Date, from_pretty: string, to_pretty: string, callback?: () => void): void {
    this.setState(prevState => ({
      ...prevState,
      range: {
        from,
        to,
        from_pretty,
        to_pretty,
      },
    }), () => {
      if (callback) callback();
    });
  }

  setThemeMap(key: MapKeys): void {
    let selectedSrcMap: string = "";

    switch (key) {
      case "darkThemeMap":
        selectedSrcMap = map3;
        break;
      case "lightThemeMap":
        selectedSrcMap = map2;
        break;
      case "sputnikThemeMap":
        selectedSrcMap = map1;
        break;
    }

    this.setState(prevState => ({
      ...prevState,
      lightThemeMap: false,
      darkThemeMap: false,
      sputnikThemeMap: false,
      selectedSrcMap,
      [key]: true,
    }));
  }

  setSelectedTree(data: GeoJsonTreePointRequested): void {
    this.setState(prevState => ({
      ...prevState,
      selectedTree: data,
    }));
  }

  resetTreeFilters(): void {
    this.setState(prevState => ({
      ...prevState,
      ...this.defaultValues,
    }));
  }

  setFilterVolunteerState(value: boolean): void {
    this.setState(prevState => ({
      ...prevState,
      filteredByVolunteers: value,
    }));
  }
}

export default MapContextProvider;
