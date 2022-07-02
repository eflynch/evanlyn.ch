import synchronize from './synchronize'
import magnolia from './magnolia'

export default function rootReducer(state, action) {
    return {
        synchronize: synchronize(state.synchronize, action),
        magnolia: magnolia(state.magnolia, action),
        whose: state.whose
    };
};
