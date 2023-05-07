import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTagListReq } from "../requests/api";
import { FormatData } from "../hooks/formatData";
export const { getTagList } = {
    getTagList: createAsyncThunk('tagList/getTagList', async (params: tagListParams) => {
        let res = await getTagListReq(params);
        return res.data
    })
}
const initialState: reqDataStateType = {
    tagListData: { data: [], totalPage: 0 }
}
const reqDataSlice = createSlice({
    name: 'reqData',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(getTagList.fulfilled, (state, action) => {
                action.payload.data.forEach(el => {
                    el.createTime = FormatData(el.createTime)
                })
                state.tagListData = action.payload;
            })
    }
})

export default reqDataSlice.reducer;