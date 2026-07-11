// Enables jest-dom matchers (toBeInTheDocument, etc.)
import '@testing-library/jest-dom';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

expect.extend(matchers);
