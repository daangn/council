import { createApp } from './base';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root')!, createApp());
