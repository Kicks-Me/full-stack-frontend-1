import { useEffect, useState } from "react";
import { tUser } from "../types/user.type";
import { api } from "../config/axios.conf";
import { useAuth } from "../context/auth.context";

export const useUsers = () => {
  const [users, setUsers] = useState<tUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {auth} = useAuth();

  const fetchUsers = async ( keyword?: string ) => {
    try 
    {
      const result = await api.get("/get-users", {
        params: keyword ? { search: keyword } : {},
        headers: {
          Authorization: 'Bearer '+ auth?.accessToken
        }
      });
      
      setUsers(result.data.data || []);

    } 
    catch (err: any) 
    {
      setError(err.message || "Error fetching users");
    } 
    finally 
    {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};