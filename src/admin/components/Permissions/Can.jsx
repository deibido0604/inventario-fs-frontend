import { AbilityContext } from '../../context/AbilityContext';
import { createContextualCan } from '@casl/react';

const Can = createContextualCan(AbilityContext.Consumer);

export default Can;