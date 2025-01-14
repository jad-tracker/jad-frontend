import {
    Avatar, Button,
    Dialog, DialogActions,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    styled, TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import React, {useState} from "react";
import {Issue} from "../../services/IssueService";
import Box from "@mui/material/Box";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";

interface IssueDetailDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen:  React.Dispatch<React.SetStateAction<boolean>>
    isEditing: boolean;
    setIsEditing:  React.Dispatch<React.SetStateAction<boolean>>
    handleIssueUpdate: (issue: Issue) => void;
    dialogIssue: Issue;
    setDialogIssue:  React.Dispatch<React.SetStateAction<Issue>>;
}

export default function IssueDetailDialog({isDialogOpen, setIsDialogOpen, isEditing, setIsEditing, dialogIssue, setDialogIssue, handleIssueUpdate}: IssueDetailDialogProps) {
    const [editSummary, setEditSummary] = useState<string>(dialogIssue.summary);
    const [editStatus, setEditStatus] = useState<string>(dialogIssue.status);
    const [editType, setEditType] = useState<string>(dialogIssue.type);
    const [editDescription, setEditDescription] = useState<string>(dialogIssue.description);

    const ExitButton = styled(CloseIcon)(({ theme }) => ({
        padding: "3px",
        fontSize: "2em",
        '&:hover': {
            borderRadius: "2px",
            backgroundColor: "#e0e0e0",
        },
    }));

    const EditButton = styled(EditIcon)(({ theme }) => ({
        padding: "3px",
        fontSize: "2em",
        '&:hover': {
            borderRadius: "2px",
            backgroundColor: "#e0e0e0",
        },
    }))

    const LargeDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialog-container": {
            "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "800px",
                margin: "50px"
            },
        },
    }))

    const handleStatusChange = (event: SelectChangeEvent) => {
        const iss = {
            ...dialogIssue,
            status: event.target.value,
        };
        handleIssueUpdate(iss);
        setDialogIssue(iss);
    };

    const updateTempStatus = () => {

    }

    const updateTempType = () => {

    }

    if (!isEditing) {
        return (
            <LargeDialog open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
            >
                <Stack spacing={4} sx={{minWidth: "500px", minHeight: "300px", margin: "20px"}}>
                    <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h1" fontSize={24} fontWeight={400}>
                            {dialogIssue?.summary}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <EditButton onClick={() => setIsEditing(true)}/>
                            <ExitButton onClick={() => setIsDialogOpen(false)}/>
                        </Stack>
                    </Stack>

                    <Stack direction="row" sx={{justifyContent: "space-between"}}>
                        <Box>
                            <Typography variant="h3" fontSize={16} fontWeight={600} margin="5px">
                               Description
                            </Typography>
                            <Typography variant="body1">
                                {dialogIssue?.description}
                            </Typography>
                        </Box>

                        <Stack>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="details-dialog-status-label">Status</InputLabel>
                                <Select labelId="details-dialog-status-label"
                                        value={dialogIssue?.status}
                                        onChange={handleStatusChange}
                                >
                                    <MenuItem value="TODO">To Do</MenuItem>
                                    <MenuItem value="DOING">In Progress</MenuItem>
                                    <MenuItem value="DONE">Done</MenuItem>
                                </Select>
                            </FormControl>

                            <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "baseline", marginTop: "20px"}}>
                                <Typography sx={{fontSize: 14, color: "#19857b", marginRight: "40px"}}>Assignee</Typography>
                                <Stack direction="row" sx={{justifyContent: "right", alignItems: "baseline"}}>
                                    <Avatar variant="rounded"
                                            sx={{bgcolor: stringToColor(dialogIssue.assignee), width: "25px", height: "25px", fontSize: "small"}}>
                                        {avatarInitials(dialogIssue.assignee)}
                                    </Avatar>
                                    <Typography sx={{fontSize: 14, marginLeft: "5px", color: "secondary"}}>{dialogIssue.assignee}</Typography>
                                </Stack>
                            </Stack>

                            <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "baseline", marginTop: "20px"}}>
                                <Typography sx={{fontSize: 14, color: "#19857b", marginRight: "40px"}}>Type</Typography>
                                <Stack direction="row" sx={{justifyContent: "right", alignItems: "baseline"}}>
                                    <Typography sx={{fontSize: 14, color: "secondary", textTransform: "capitalize"}}>{dialogIssue.type.toLowerCase()}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                </Stack>

            </LargeDialog>
        );
    } else { // Edit mode
        return (
            <LargeDialog open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
            >
                <Stack  sx={{minWidth: "500px", minHeight: "300px", margin: "20px", justifyContent: "space-between"}}>
                    <Stack spacing={4}>
                        <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                            <TextField label="Issue Summary" size="medium"  sx={{minWidth: "350px"}} value={editSummary} onChange={e => setEditSummary(e.target.value)} />
                            <Stack direction="row" spacing={1}>
                                <ExitButton onClick={() => setIsDialogOpen(false)}/>
                            </Stack>
                        </Stack>
                        <Stack direction="row" sx={{justifyContent: "space-between"}}>
                            <Box>
                                {/*<Typography variant="h3" fontSize={16} fontWeight={600} margin="5px">*/}
                                {/*    Description*/}
                                {/*</Typography>*/}
                                <TextField multiline value={editDescription}
                                           onChange={e => setEditDescription(e.target.value)}
                                           label="Description"
                                           variant="outlined"
                                           minRows={4}
                                           sx={{minWidth: "350px"}}
                                />
                            </Box>

                            <Stack>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="details-dialog-status-label">Status</InputLabel>
                                    <Select labelId="details-dialog-status-label"
                                            value={editStatus}
                                            onChange={e => setEditStatus(e.target.value)}
                                    >
                                        <MenuItem value="TODO">To Do</MenuItem>
                                        <MenuItem value="DOING">In Progress</MenuItem>
                                        <MenuItem value="DONE">Done</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="details-dialog-status-label">Type</InputLabel>
                                    <Select labelId="details-dialog-status-label"
                                            value={dialogIssue?.status}
                                            onChange={updateTempType}
                                    >
                                        <MenuItem value="STORY">Story</MenuItem>
                                        <MenuItem value="TASK">Task</MenuItem>
                                        <MenuItem value="BUG">Bug</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Stack>
                    <DialogActions sx={{justifySelf: "flex-end"}}>
                        <Button color="primary" variant="contained" onClick={() => {}}>Save</Button>
                        <Button color="secondary" variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </DialogActions>
                </Stack>
            </LargeDialog>
        );
    }
}