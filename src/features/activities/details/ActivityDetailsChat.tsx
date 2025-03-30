import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Link, useParams } from "react-router";
import { useComments } from "@/libs/hooks/useComments";
import { useState } from "react";
import { timeAgo } from "@/libs/utils/format-date";

export default function ActivityDetailsChat() {
  const { id } = useParams<{ id: string }>();
  const [body, setBody] = useState("");

  const { comments, createComment, isCreatingComment } = useComments(id ?? "");

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!id) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      createComment({
        body,
        activityId: id,
      });
      setBody("");
    }
  };
  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
          padding: 2,
        }}
      >
        <Typography variant="h6">Chat about this event</Typography>
      </Box>
      <Card>
        <CardContent>
          <div>
            <form>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"
                onKeyDown={handleKeyPress}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: isCreatingComment ? (
                      <CircularProgress size={24} />
                    ) : null,
                  },
                }}
                disabled={isCreatingComment}
              />
            </form>
          </div>

          <Box sx={{ height: 400, overflow: "auto" }}>
            {comments &&
              comments.map((comment) => (
                <Box sx={{ display: "flex", my: 2 }} key={comment.id}>
                  <Avatar
                    src={comment.imageUrl ?? "/images/user.png"}
                    alt={"user image"}
                    sx={{ mr: 2 }}
                  />
                  <Box display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center" gap={3}>
                      <Typography
                        component={Link}
                        to={`/profiles/${comment.displayName}`}
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", textDecoration: "none" }}
                      >
                        {comment.displayName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {timeAgo(new Date(comment.createdAt))}
                      </Typography>
                    </Box>

                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {comment.body}
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
