export type tUser = {
    id: number;
    username: string;
    role: "user" | "admin";
    created_at: string;
}