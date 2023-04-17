import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTagListReq } from "../requests/api";
export const { getTagList } = {
    getTagList: createAsyncThunk('tagList/getTagList', async (params: tagListParams) => {
        let res = await getTagListReq(params);
        return res.data
    })
}
const initialState: reqDataStateType = {
    tagListData: { data: [], totalNumber: 0 }
}
const reqDataSlice = createSlice({
    name: 'reqData',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(getTagList.fulfilled, (state, action) => {
                function formatMsToDate(ms: string) {
                    let date = new Date(Number(ms)),
                        year = date.getFullYear(),
                        month = date.getMonth() + 1,
                        day = date.getDate(),
                        hour = date.getHours(),
                        min = date.getMinutes(),
                        sec = date.getSeconds();
                    return year + '-' + addZero(month) + '-' + addZero(day) + " " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec)

                }
                function addZero(nu: number) {
                    return nu < 10 ? "0" + nu : nu
                }
                action.payload.data.forEach(el => {
                    el.createTime = formatMsToDate(el.createTime)
                })
                state.tagListData = action.payload;
            })
    }
})

export default reqDataSlice.reducer;