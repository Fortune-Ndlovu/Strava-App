import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, getCurrentUserId } from "../../firebase/firebase";
import {
    doc,
    where,
    query,
    getDocs,
    collection,
    getDoc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import Button from "react-bootstrap/Button";

const SearchUserProfile = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false); // State to track if user is already being followed

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    // Check if the current user is already following this user
                    const currentUser = getCurrentUserId();
                    if (currentUser) {
                        const userRef = doc(db, "users", currentUser);
                        const userSnapshot = await getDoc(userRef);
                        if (userSnapshot.exists()) {
                            const userData = userSnapshot.data();
                            setIsFollowing(userData.following.includes(userId));
                        }
                    }
                } else {
                    console.log("User not found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleFollow = async () => {
        try {
            const currentUser = getCurrentUserId();
            if (currentUser) {
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const followingArray = userData.following || [];
                    if (!followingArray.includes(userId)) {
                        followingArray.push(userId);
                        await updateDoc(userRef, { following: followingArray });
                        setIsFollowing(true); // Update state to reflect that the user is now being followed
                        console.log("User followed successfully!");
                    } else {
                        console.log("User already followed");
                    }
                } else {
                    console.log("User document not found");
                }
            } else {
                console.error("Current user not found");
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    return (
        <div>
            {userData ? (
                <div>
                    <h2>User Profile</h2>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <Button onClick={handleFollow}>
                        {isFollowing ? "Following" : "Follow"}
                    </Button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default SearchUserProfile;
