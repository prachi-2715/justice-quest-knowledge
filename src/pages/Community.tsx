
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUp, ArrowDown, MessageSquare, Star } from "lucide-react";

// Sample community posts
const initialPosts = [
  {
    id: "1",
    author: "Teacher Mary",
    avatar: "",
    message: "Just a reminder that every child has the right to express their opinions about matters that affect them. Article 12 of the UN Convention on the Rights of the Child protects this right!",
    likes: 15,
    comments: 3,
    createdAt: "2 days ago",
    userLiked: false
  },
  {
    id: "2",
    author: "Rights Champion",
    avatar: "",
    message: "Today at school we had a debate about children's rights to privacy. It was interesting to learn that even kids have the right to keep some things private!",
    likes: 8,
    comments: 5,
    createdAt: "3 days ago",
    userLiked: false
  },
  {
    id: "3",
    author: "Justice Educator",
    avatar: "",
    message: "Did you know? The UN Convention on the Rights of the Child is the most widely ratified human rights treaty in history! It sets out the civil, political, economic, social, health and cultural rights of children.",
    likes: 22,
    comments: 7,
    createdAt: "1 week ago",
    userLiked: false
  }
];

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something before posting.",
        variant: "destructive"
      });
      return;
    }

    const post = {
      id: Math.random().toString(36).substring(2, 9),
      author: user?.name || "Anonymous",
      avatar: user?.avatar || "",
      message: newPost,
      likes: 0,
      comments: 0,
      createdAt: "Just now",
      userLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost("");

    toast({
      title: "Post Created",
      description: "Your thoughts have been shared with the community!",
    });
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.userLiked ? post.likes - 1 : post.likes + 1,
          userLiked: !post.userLiked
        };
      }
      return post;
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">
          Connect with other rights explorers and share your thoughts!
        </p>
      </div>

      {/* Create Post */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share Your Thoughts</CardTitle>
          <CardDescription>
            Post questions, insights, or experiences about children's rights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's on your mind about rights?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Be respectful and kind to others
          </p>
          <Button onClick={handleCreatePost}>
            Post
          </Button>
        </CardFooter>
      </Card>

      {/* Community Guidelines */}
      <Card className="mb-8 bg-muted/30 border-muted">
        <CardHeader className="pb-2">
          <CardTitle>Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Be respectful and kind to everyone in the community</li>
            <li>Share knowledge about rights and responsibilities</li>
            <li>Ask questions if you're unsure about something</li>
            <li>Protect your privacy - don't share personal information</li>
            <li>Report inappropriate content to a trusted adult</li>
          </ul>
        </CardContent>
      </Card>

      {/* Community Posts */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Recent Posts</h2>
        
        {posts.map((post) => (
          <Card key={post.id} className="border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{post.author}</CardTitle>
                    <CardDescription>{post.createdAt}</CardDescription>
                  </div>
                </div>
                {post.author === "Teacher Mary" && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-justice-orange mr-1" />
                    <span className="text-xs font-medium text-justice-orange">Verified Educator</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm lg:text-base">{post.message}</p>
            </CardContent>
            <CardFooter className="flex justify-between text-muted-foreground text-sm">
              <div className="flex items-center space-x-4">
                <button 
                  className={`flex items-center gap-1 ${post.userLiked ? 'text-justice-blue' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  {post.userLiked ? (
                    <ArrowDown className="h-4 w-4" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
              <button className="text-justice-blue text-sm">Reply</button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;
