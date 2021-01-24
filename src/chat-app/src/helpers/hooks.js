import { useCallback, useState } from 'react';

const [, updateState] = useState({});
const useForceUpdate = useCallback(() => updateState({}), []);

export default useForceUpdate;
