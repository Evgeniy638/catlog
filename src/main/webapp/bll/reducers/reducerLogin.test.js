import reducerLogin, { loginActionCreators, loginGetters } from "./reducerLogin";
import configureStore from 'redux-mock-store';

const middlewares = []
const mockStore = configureStore(middlewares);

describe("Test reducerLogin", () => {
    it("test close login", () => {
        let state1 = {
            isOpenLogin: true
        };
        state1 = reducerLogin(state1, { type: "CLOSE_LOGIN" });
        expect(state1.isOpenLogin).toBe(false);

        let state2 = {
            isOpenLogin: false
        };
        state2 = reducerLogin(state2, { type: "CLOSE_LOGIN" });
        expect(state2.isOpenLogin).toBe(false);
    });

    it("test toggle login", () => {
        let state1 = {
            isOpenLogin: true
        };
        state1 = reducerLogin(state1, { type: "TOGGLE_OPEN_LOGIN" });
        expect(state1.isOpenLogin).toBe(false);

        let state2 = {
            isOpenLogin: false
        };
        state2 = reducerLogin(state2, { type: "TOGGLE_OPEN_LOGIN" });
        expect(state2.isOpenLogin).toBe(true);
    });

    it("test default", () => {
        const initialState = {};
        const resultState = reducerLogin(initialState, { type: "" });
        expect(resultState).toBe(resultState);
    });

    it("test initial state", () => {
        const initialState = reducerLogin(undefined, { type: "" });
        expect(initialState).toEqual({
            isOpenLogin: false
        });
    })
});

describe("Test action creators in reducerLogin", () => {
    it("test toggle open form", () => {
        expect(loginActionCreators.toggleOpen()).toEqual({ type: "TOGGLE_OPEN_LOGIN" });
    });

    it("test close open form", () => {
        expect(loginActionCreators.close()).toEqual({ type: "CLOSE_LOGIN" });
    });
});


describe("Test getters in reducerLogin", () => {
    it("test getIsOpenLogin", () => {
        let reducerLogin = {
            isOpenLogin: false
        }
        const store = mockStore({ reducerLogin });

        expect(loginGetters.getIsOpenLogin(store.getState())).toBe(reducerLogin.isOpenLogin);

        reducerLogin.isOpenLogin = true;

        expect(loginGetters.getIsOpenLogin(store.getState())).toBe(reducerLogin.isOpenLogin);
    });
});
