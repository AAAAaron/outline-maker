import { RouteComponentProps } from 'react-router-dom';
import { Character } from '../character/characterDec';
import { Outline } from '../sidebar/sidebarDec';
import { Location } from '../location/locationDec';

interface MatchParams {
  id: string;
}

export interface NovelProps extends RouteComponentProps<MatchParams> {
  expand: boolean;
}

export interface NovelState {
  id: string;
  name: string;
  description: string;
  wordview: string;
  categories: string[];
  characters: Character[];
  outlines: Outline[];
  locations: Location[];
  createCharacter: boolean;
  createOutline: boolean;
  createLocation: boolean;
  shouldRenderCharacter: boolean;
  shouldRenderOutline: boolean;
  shouldRenderLocation: boolean;
}