| #   | Endpoint           | Method  | Auth  | Description                                                                | Request Payload                                      | Response Structure                                                                                                                                                                                                                                |
| --- | ------------------ | ------- | ----- | -------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | `/blog/`           | **GET** | Basic | Retrieve all blogs. Optionally filter by category using `?category=<name>` | **Query Params:**<br>`category`: string *(optional)* | `json { "status": true, "message": "Blogs retrieved successfully", "data": [ { "title": "Sample Blog", "category": "Beauty", "content": "<p>Blog content...</p>", "created_at": "2025-08-24", "thumbnail": "/media/Blog/images/sample.png" } ] }` |
| 1.2 | `/blog/{blog_id}/` | **GET** | Basic | Retrieve a single blog by ID.                                              | **Path Params:**<br>`blog_id`: integer *(required)*  | `json { "status": true, "message": "Blog retrieved successfully", "data": { "title": "Sample Blog", "category": "Beauty", "content": "<p>Blog content...</p>", "created_at": "2025-08-24", "thumbnail": "/media/Blog/images/sample.png" } }`      |


| #    | Endpoint                                    | Method     | Auth  | Description                                                      | Request Payload                                                                                                                                                                       | Response Structure                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---- | ------------------------------------------- | ---------- | ----- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1  | `/business/approved/`                       | **GET**    | Basic | Get list of approved businesses.                                 | —                                                                                                                                                                                     | `json { "status": true, "message": "Businesses retrieved successfully.", "data": [ { "id": 1, "name": "My Business", "description": "Best restaurant in town.", "address": "456 New Market Street", "thumbnail": "https://delve.com/mythumbnail.png", "logo": "https://delve.com/mylogo.png", "average_review_rating": 4 } ] }`                                                                                                |
| 2.2  | `/business/`                                | **POST**   | Basic | Create a new business.                                           | `json { "business_name": "Tech Innovators", "description": "A company that builds innovative tech solutions.", "website": "https://techinnovators.com", "logo": "logo.png" }`         | `json { "status": true, "message": "Business created successfully.", "data": { "id": 1, "name": "Tech Innovators", "description": "A company that builds innovative tech solutions.", "website": "https://techinnovators.com", "state": "Lagos", "logo": "https://delve.com/mylogo.png", "is_active": true } }`                                                                                                                |
| 2.3  | `/business/user/`                           | **GET**    | Basic | Get all businesses owned by the authenticated user.              | —                                                                                                                                                                                     | `json { "status": true, "message": "Businesses retrieved successfully.", "data": [ { "id": 1, "name": "My Business", "description": "Best restaurant in town.", "website": "https://example.com", "state": "Lagos", "category": { "id": 2, "name": "Restaurant" }, "subcategories": [{ "id": 5, "name": "Italian" }], "images": ["https://example.com/media/business/image1.jpg"], "approved": false, "is_active": true } ] }` |
| 2.4  | `/business/search/`                         | **GET**    | Basic | Search for businesses by query, category, state, or coordinates. | **Query Params:**<br>`q`: string *(optional)*<br>`category`: string *(optional)*<br>`state`: string *(optional)*<br>`longitude`: float *(optional)*<br>`latitude`: float *(optional)* | `json { "status": true, "message": "Search results retrieved successfully.", "data": [ { "id": 1, "name": "My Business", "description": "Best restaurant in town.", "address": "456 New Market Street", "logo": "https://delve.com/mylogo.png" } ] }`                                                                                                                                                                          |
| 2.5  | `/business/trending/`                       | **GET**    | Basic | Get the most trending businesses.                                | —                                                                                                                                                                                     | `json { "status": true, "message": "Business retrieved successfully.", "data": { "id": 1, "name": "My Business", "description": "Best restaurant in town.", "category": { "id": 2, "name": "Restaurant" }, "number_of_profile_visits": 200 } }`                                                                                                                                                                                |
| 2.6  | `/business/{business_id}/`                  | **GET**    | Basic | Retrieve details of a specific business by ID.                   | **Path Params:**<br>`business_id`: integer<br>`page`: string *(dashboard if owner)*                                                                                                   | `json { "status": true, "message": "Business retrieved successfully.", "data": { "id": 1, "name": "My Business", "owner": { "id": 5, "email": "owner@example.com" }, "category": { "id": 2, "name": "Restaurant" }, "services": [ { "id": 1, "title": "Car Repair" } ], "performance": [ { "date": "09-12-2025", "performance_score": 56 } ] } }`                                                                              |
| 2.7  | `/business/{business_id}/`                  | **DELETE** | Basic | Delete a business owned by the authenticated user.               | —                                                                                                                                                                                     | `json { "status": true, "message": "Business deleted successfully." }`                                                                                                                                                                                                                                                                                                                                                         |
| 2.8  | `/business/{business_id}/`                  | **PATCH**  | Basic | Update business info (name, desc, logo, etc.)                    | `json { "business_name": "string", "description": "string", "website": "string", "logo": "string" }`                                                                                  | `json { "status": true, "message": "Business updated successfully" }`                                                                                                                                                                                                                                                                                                                                                          |
| 2.9  | `/business/{business_id}/performance/`      | **GET**    | Basic | Retrieve business performance metrics.                           | **Query Params:**<br>`filter`: string (this_month / last_6_months / last_12_months / all_time)<br>`metric`: string (conversations / reviews / profile_visits / saved_by_users)        | `json { "status": true, "data": { "totals": { "total_conversations": 120, "total_reviews": 35 }, "graph": [ { "created_at": "01 Sep", "value": 10 } ] } }`                                                                                                                                                                                                                                                                     |
| 2.10 | `/business/{business_id}/request-approval/` | **POST**   | Basic | Request business approval.                                       | —                                                                                                                                                                                     | `json { "status": true, "message": "Business approval request sent" }`                                                                                                                                                                                                                                                                                                                                                         |
| 2.11 | `/business/{business_id}/update-amenities/` | **PATCH**  | Basic | Update amenities for a business.                                 | `json { "amenities_ids": [1, 2, 3] }`                                                                                                                                                 | `json { "status": true, "message": "Business amenities updated successfully." }`                                                                                                                                                                                                                                                                                                                                               |
| 2.12 | `/business/{business_id}/update-category/`  | **PATCH**  | Basic | Update category and subcategories.                               | `json { "category_id": 2, "subcategory_ids": [5, 6, 7] }`                                                                                                                             | `json { "status": true, "message": "Business category updated successfully." }`                                                                                                                                                                                                                                                                                                                                                |
| 2.13 | `/business/{business_id}/update-location/`  | **PATCH**  | Basic | Update location & contact info.                                  | `json { "address": "456 New Market Street", "state": "Lagos", "longitude": 3.3792, "latitude": 6.5244 }`                                                                              | `json { "status": true, "message": "Business address updated successfully." }`                                                                                                                                                                                                                                                                                                                                                 |
| 2.14 | `/business/{business_id}/activation/`       | **PATCH**  | Basic | Activate or deactivate a business.                               | `json { "activation_status": "activate", "business_name": "string", "reason_for_deactivation": "string" }`                                                                            | `json { "status": true, "message": "Business account activated successfully" }`                                                                                                                                                                                                                                                                                                                                                |


| #   | Endpoint                   | Method  | Auth  | Description                                        | Request Payload                                      | Response Structure                                                                                                           |
| --- | -------------------------- | ------- | ----- | -------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | `/business/amenities/`     | **GET** | Basic | Retrieve all business amenities.                   | —                                                    | `json { "status": true, "data": [ { "id": 1, "name": "Wi-Fi" }, { "id": 2, "name": "Parking Space" } ] }`                    |
| 3.2 | `/business/categories/`    | **GET** | Basic | Retrieve all business categories.                  | —                                                    | `json { "status": true, "data": [ { "id": 1, "name": "Restaurant", "subcategories": [ { "id": 2, "name": "Bakery" } ] } ] }` |
| 3.3 | `/business/states/`        | **GET** | Basic | Retrieve list of supported Nigerian states.        | —                                                    | `json { "status": true, "data": [ { "name": "Lagos" }, { "name": "Abuja" } ] }`                                              |
| 3.4 | `/business/subcategories/` | **GET** | Basic | Retrieve subcategories (optional category filter). | **Query Params:**<br>`category`: string *(optional)* | `json { "status": true, "data": [ { "id": 2, "name": "Bakery", "category": "Restaurant" } ] }`                               |


| #   | Endpoint                          | Method     | Auth  | Description                              | Request Payload                               | Response Structure                                                                                                                                                |
| --- | --------------------------------- | ---------- | ----- | ---------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | `/business/image/delete/`         | **DELETE** | Basic | Delete an image from a business gallery. | `json { "image_ids": [5, 6, 8] }`             | `json { "status": true, "message": "Images deleted successfully." }`                                                                                              |
| 4.2 | `/business/{business_id}/images/` | **POST**   | Basic | Upload multiple images for a business.   | **FormData:**<br>`images`: [file, file, file] | `json { "status": true, "message": "Images uploaded successfully.", "data": [ "https://example.com/media/image1.jpg", "https://example.com/media/image2.jpg" ] }` |



| #   | Endpoint                                         | Method     | Auth  | Description                             | Request Payload                                                                                | Response Structure                                                                                                  |
| --- | ------------------------------------------------ | ---------- | ----- | --------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 5.1 | `/business/{business_id}/services/`              | **GET**    | Basic | Get all services offered by a business. | —                                                                                              | `json { "status": true, "data": [ { "id": 1, "title": "Consultation", "price": "5000", "duration": "30 mins" } ] }` |
| 5.2 | `/business/{business_id}/services/`              | **POST**   | Basic | Add a new service or multiple services. | `json { "services": [ { "title": "Consultation", "price": "5000", "duration": "30 mins" } ] }` | `json { "status": true, "message": "Service(s) created successfully." }`                                            |
| 5.3 | `/business/{business_id}/services/{service_id}/` | **DELETE** | Basic | Delete a specific service.              | —                                                                                              | `json { "status": true, "message": "Service deleted successfully." }`                                               |
| 5.4 | `/business/{business_id}/services/{service_id}/` | **GET**    | Basic | Retrieve a specific service.            | —                                                                                              | `json { "status": true, "data": { "id": 1, "title": "Consultation", "price": "5000", "duration": "30 mins" } }`     |
| 5.5 | `/business/{business_id}/services/{service_id}/` | **PATCH**  | Basic | Update a business service.              | `json { "title": "Updated Service", "price": "7000", "duration": "45 mins" }`                  | `json { "status": true, "message": "Service updated successfully." }`                                               |


| #   | Endpoint                                 | Method   | Auth  | Description                         | Request Payload                                                 | Response Structure                                                                                                                                                                       |
| --- | ---------------------------------------- | -------- | ----- | ----------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6.1 | `/business/{business_id}/reviews/`       | **GET**  | Basic | Retrieve reviews (with replies).    | **Query Params:**<br>`page`: number *(optional)*                | `json { "status": true, "data": [ { "id": 1, "rating": 5, "comment": "Great service!", "user": { "id": 4, "username": "John" }, "replies": [ { "id": 2, "reply": "Thank you!" } ] } ] }` |
| 6.2 | `/business/{business_id}/reviews/`       | **POST** | Basic | Create a new review for a business. | `json { "rating": 5, "comment": "Amazing food and staff!" }`    | `json { "status": true, "message": "Review created successfully." }`                                                                                                                     |
| 6.3 | `/business/{business_id}/reviews/reply/` | **POST** | Basic | Reply to a specific review.         | `json { "review_id": 1, "reply": "Thanks for your feedback!" }` | `json { "status": true, "message": "Reply added successfully." }`                                                                                                                        |



| #   | Endpoint                        | Method        | Auth  | Description                              | Request Payload                                     | Response Structure                                                                                                  |
| --- | ------------------------------- | ------------- | ----- | ---------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 7.1 | `/chat/add-image/`              | **POST**      | Basic | Send an image in chat.                   | **FormData:**<br>`chat_id`: int<br>`images`: [file] | `json { "status": true, "message": "Image sent successfully." }`                                                    |
| 7.2 | `/chat/business/{business_id}/` | **GET**       | Basic | Get all chats for a business.            | —                                                   | `json { "status": true, "data": [ { "chat_id": 15, "last_message": "Hello there", "updated_at": "2025-09-10" } ] }` |
| 7.3 | `/chat/{chat_id}/delete/`       | **DELETE**    | Basic | Delete all messages in a chat.           | —                                                   | `json { "status": true, "message": "Chat deleted successfully." }`                                                  |
| 7.4 | `/chat/user/`                   | **GET**       | Basic | Get all user chats.                      | —                                                   | `json { "status": true, "data": [ { "chat_id": 10, "business": "My Shop", "last_message": "Hello" } ] }`            |
| 7.5 | `/chat/{chat_id}/messages/`     | **GET**       | Basic | Retrieve all messages in a chat thread.  | —                                                   | `json { "status": true, "data": [ { "sender": "user", "message": "Hi", "timestamp": "2025-09-12T10:00Z" } ] }`      |
| 7.6 | `ws://.../chat/{business_id}/`  | **WebSocket** | Basic | Real-time chat connection for messaging. | —                                                   | —                                                                                                                   |





| #    | Endpoint                                         | Method     | Auth  | Description                                             | Request Payload                                               | Response Structure                                                                                                        |
| ---- | ------------------------------------------------ | ---------- | ----- | ------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 8.1  | `/collaboration/`                                | **POST**   | Basic | Create a new collaboration between users or businesses. | `json { "name": "Joint Venture", "business_ids": [1, 2, 3] }` | `json { "status": true, "message": "Collaboration created successfully.", "data": { "id": 1, "name": "Joint Venture" } }` |
| 8.2  | `/collaboration/`                                | **GET**    | Basic | Retrieve all collaborations the user is part of.        | —                                                             | `json { "status": true, "data": [ { "id": 1, "name": "Joint Venture", "members": 4 } ] }`                                 |
| 8.3  | `/collaboration/invite/{member_id}/`             | **PATCH**  | Basic | Accept or reject a collaboration invite.                | `json { "status": "accepted" }`                               | `json { "status": true, "message": "Invite status updated." }`                                                            |
| 8.4  | `/collaboration/member/{member_id}/privilege/`   | **PATCH**  | Basic | Update member privilege (e.g. admin, editor).           | `json { "privilege": "editor" }`                              | `json { "status": true, "message": "Member privilege updated successfully." }`                                            |
| 8.5  | `/collaboration/member/{member_id}/`             | **DELETE** | Basic | Remove a member or leave a collaboration.               | —                                                             | `json { "status": true, "message": "Member removed from collaboration." }`                                                |
| 8.6  | `/collaboration/{collab_id}/`                    | **GET**    | Basic | Retrieve full details of a collaboration.               | —                                                             | `json { "status": true, "data": { "id": 1, "name": "Joint Venture", "members": [ { "id": 4, "role": "admin" } ] } }`      |
| 8.7  | `/collaboration/{collab_id}/businesses/replace/` | **PATCH**  | Basic | Replace all businesses in collaboration.                | `json { "business_ids": [1, 5, 9] }`                          | `json { "status": true, "message": "Collaboration businesses replaced successfully." }`                                   |
| 8.8  | `/collaboration/{collab_id}/businesses/remove/`  | **DELETE** | Basic | Remove a specific business from collaboration.          | `json { "business_id": 5 }`                                   | `json { "status": true, "message": "Business removed from collaboration." }`                                              |
| 8.9  | `/collaboration/{collab_id}/`                    | **DELETE** | Basic | Delete a collaboration.                                 | —                                                             | `json { "status": true, "message": "Collaboration deleted successfully." }`                                               |
| 8.10 | `/collaboration/{collab_id}/`                    | **PATCH**  | Basic | Update collaboration name or description.               | `json { "name": "Updated Collaboration" }`                    | `json { "status": true, "message": "Collaboration updated successfully." }`                                               |


| #   | Endpoint   | Method  | Auth  | Description                                        | Request Payload | Response Structure                                                                                                                                                                                                                              |
| --- | ---------- | ------- | ----- | -------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9.1 | `/events/` | **GET** | Basic | Retrieve current or upcoming events for the month. | —               | `json { "status": true, "message": "Events retrieved successfully.", "data": [ { "id": 1, "title": "Business Expo 2025", "description": "Networking event for entrepreneurs", "date": "2025-11-15", "location": "Landmark Centre, Lagos" } ] }` |


| #    | Endpoint                                 | Method        | Auth  | Description                           | Request Payload | Response Structure                                                                                                                                                                                      |
| ---- | ---------------------------------------- | ------------- | ----- | ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10.1 | `/notifications/`                        | **GET**       | Basic | Retrieve all user notifications.      | —               | `json { "status": true, "data": [ { "id": 3, "title": "Subscription Renewed", "body": "Your premium plan has been renewed successfully.", "is_read": false, "created_at": "2025-10-02T12:00:00Z" } ] }` |
| 10.2 | `/notifications/mark-all/`               | **POST**      | Basic | Mark all notifications as read.       | —               | `json { "status": true, "message": "All notifications marked as seen." }`                                                                                                                               |
| 10.3 | `/notifications/{notification_id}/seen/` | **PATCH**     | Basic | Mark a specific notification as read. | —               | `json { "status": true, "message": "Notification marked as seen." }`                                                                                                                                    |
| 10.4 | `ws://.../notification/`                 | **WebSocket** | Basic | Real-time notification stream.        | —               | `json { "event": "notification", "data": { "title": "New Message", "body": "You have a new chat." } }`                                                                                                  |


| #    | Endpoint                             | Method   | Auth  | Description                        | Request Payload | Response Structure                                                                                                                                                                   |
| ---- | ------------------------------------ | -------- | ----- | ---------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 11.1 | `/payment/premium-plans/`            | **GET**  | Basic | Retrieve available premium plans.  | —               | `json { "status": true, "data": [ { "id": 1, "name": "Standard", "price": 5000, "duration": "1 month" }, { "id": 2, "name": "Premium", "price": 12000, "duration": "3 months" } ] }` |
| 11.2 | `/payment/subscription/cancel/`      | **POST** | Basic | Cancel active subscription.        | —               | `json { "status": true, "message": "Subscription cancelled successfully." }`                                                                                                         |
| 11.3 | `/payment/subscription/change-card/` | **GET**  | Basic | Get link to change billing card.   | —               | `json { "status": true, "message": "Card update link generated.", "data": { "url": "https://checkout.stripe.com/update_card" } }`                                                    |
| 11.4 | `/payment/subscription/retry/`       | **POST** | Basic | Retry failed subscription payment. | —               | `json { "status": true, "message": "Retry successful, card charged." }`                                                                                                              |


| #    | Endpoint       | Method  | Auth  | Description                        | Request Payload | Response Structure                                                                                                   |
| ---- | -------------- | ------- | ----- | ---------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- |
| 12.1 | `/ads/active/` | **GET** | Basic | Retrieve all active sponsored ads. | —               | `json { "status": true, "data": [ { "id": 1, "image": "https://example.com/ad.png", "business": "Fashion Hub" } ] }` |



| #    | Endpoint            | Method     | Auth  | Description                                  | Request Payload                                                                     | Response Structure                                                                                                                                                                               |
| ---- | ------------------- | ---------- | ----- | -------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 13.1 | `/user/`            | **GET**    | Basic | Retrieve authenticated user details.         | —                                                                                   | `json { "status": true, "data": { "id": 5, "email": "user@example.com", "first_name": "Khalid", "last_name": "Oni", "profile_image": "https://example.com/profile.jpg", "is_verified": true } }` |
| 13.2 | `/user/deactivate/` | **PATCH**  | Basic | Deactivate user account (temporary disable). | `json { "reason": "Taking a break" }`                                               | `json { "status": true, "message": "Account deactivated successfully." }`                                                                                                                        |
| 13.3 | `/user/delete/`     | **DELETE** | Basic | Permanently delete user account.             | —                                                                                   | `json { "status": true, "message": "Account deleted successfully." }`                                                                                                                            |
| 13.4 | `/user/update/`     | **PATCH**  | Basic | Update user profile or password.             | `json { "first_name": "Khalid", "last_name": "Oni", "password": "newPassword123" }` | `json { "status": true, "message": "User profile updated successfully." }`                                                                                                                       |



| #    | Endpoint          | Method   | Auth | Description                               | Request Payload                                  | Response Structure                                                                               |
| ---- | ----------------- | -------- | ---- | ----------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 14.1 | `/auth/facebook/` | **POST** | None | Facebook Login/Signup using access token. | `json { "access_token": "facebook_user_token" }` | `json { "status": true, "message": "Login successful.", "data": { "token": "jwt_token_here" } }` |
| 14.2 | `/auth/google/`   | **POST** | None | Google OAuth Login/Signup.                | `json { "access_token": "google_user_token" }`   | `json { "status": true, "message": "Login successful.", "data": { "token": "jwt_token_here" } }` |



| #    | Endpoint          | Method   | Auth  | Description                             | Request Payload                                                                                                 | Response Structure                                                                                                                  |
| ---- | ----------------- | -------- | ----- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 15.1 | `/auth/logout/`   | **POST** | Basic | Logout authenticated user.              | —                                                                                                               | `json { "status": true, "message": "Logout successful." }`                                                                          |
| 15.2 | `/auth/register/` | **POST** | None  | Register a new user.                    | `json { "email": "user@example.com", "password": "mypassword123", "first_name": "Khalid", "last_name": "Oni" }` | `json { "status": true, "message": "Registration successful.", "data": { "id": 5, "email": "user@example.com" } }`                  |
| 15.3 | `/auth/login/`    | **POST** | None  | Authenticate user and issue JWT tokens. | `json { "email": "user@example.com", "password": "mypassword123" }`                                             | `json { "status": true, "message": "Login successful.", "data": { "access": "jwt_access_token", "refresh": "jwt_refresh_token" } }` |
| 15.4 | `/auth/refresh/`  | **POST** | None  | Refresh JWT access token.               | `json { "refresh": "jwt_refresh_token" }`                                                                       | `json { "status": true, "access": "new_access_token" }`                                                                             |




| #    | Endpoint                        | Method   | Auth | Description                   | Request Payload                                                                            | Response Structure                                                        |
| ---- | ------------------------------- | -------- | ---- | ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| 16.1 | `/auth/password-reset/request/` | **POST** | None | Request a password reset OTP. | `json { "email": "user@example.com" }`                                                     | `json { "status": true, "message": "Password reset OTP sent to email." }` |
| 16.2 | `/auth/password-reset/verify/`  | **POST** | None | Verify password reset OTP.    | `json { "email": "user@example.com", "otp": "123456" }`                                    | `json { "status": true, "message": "OTP verified successfully." }`        |
| 16.3 | `/auth/password-reset/reset/`   | **POST** | None | Reset password using OTP.     | `json { "email": "user@example.com", "otp": "123456", "new_password": "StrongPass#2025" }` | `json { "status": true, "message": "Password reset successful." }`        |



| #    | Endpoint         | Method  | Auth  | Description                                 | Request Payload | Response Structure                                                                                                                                              |
| ---- | ---------------- | ------- | ----- | ------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 17.1 | `/user/billing/` | **GET** | Basic | Retrieve account billing data and invoices. | —               | `json { "status": true, "data": { "plan": "Premium", "next_billing_date": "2025-12-05", "invoices": [ { "id": 1, "amount": 12000, "date": "2025-09-01" } ] } }` |



| #    | Endpoint                       | Method     | Auth  | Description                               | Request Payload             | Response Structure                                                                     |
| ---- | ------------------------------ | ---------- | ----- | ----------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| 18.1 | `/user/saved-business/`        | **GET**    | Basic | Retrieve list of user’s saved businesses. | —                           | `json { "status": true, "data": [ { "id": 1, "business_name": "Tech Innovators" } ] }` |
| 18.2 | `/user/saved-business/`        | **POST**   | Basic | Save a business to the user’s favorites.  | `json { "business_id": 2 }` | `json { "status": true, "message": "Business saved successfully." }`                   |
| 18.3 | `/user/saved-business/remove/` | **DELETE** | Basic | Remove a saved business.                  | `json { "business_id": 2 }` | `json { "status": true, "message": "Business removed from saved list." }`              |



WebSocket connection for chats
Real-time Chat WebSocket

This WebSocket enables real-time chat messaging between customers and businesses.
Assuming base url is: 127.0.0.1:8000
Connection URLs:

    Start or join a chat (chat_id auto-created if missing):
    ws://127.0.0.1:8000/chat/{business_id}/?token=<ACCESS_TOKEN>

    Join an existing chat:
    ws://127.0.0.1:8000/chat/{business_id}/{chat_id}/?token=<ACCESS_TOKEN>

Authentication:

    You must pass a valid JWT access token as a query parameter (?token=...).
    If token is missing or invalid, the connection will be rejected.

Notes:

    Use ws:// for development (or insecure).
    Use wss:// for production (or secure).

Sending Messages

    Text Messages → Sent directly via WebSocket using JSON payloads.
    Image Messages → Sent via REST API and then broadcasted automatically in real-time to the WebSocket.

Image Upload Endpoint:

    POST http://127.0.0.1:8000/api/chat/add-image/
    Required fields:
        chat_id (integer)
        images (one or multiple image files sent in an array)
            Example:
                One image upload: ['image1.jpg']
                Multiple image upload: ['image1.jpg', 'image2.png']
    The uploaded images are broadcast instantly to all chat participants.

Example Frontend Usage (JavaScript):

// Connect to chat (new or existing)
const socket = new WebSocket(
  "ws://127.0.0.1:8000/chat/1/?token=YOUR_ACCESS_TOKEN"
);

socket.onopen = () => {
  console.log("Connected to chat socket");

  // Send a text message
  socket.send(JSON.stringify({
    message_type: "text",
    sender_id: 1,
    message: "Hello, I’d like to ask about your services."
  }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("New message:", data);
};

socket.onclose = (event) => {
  console.log("Socket closed:", event.code);
};

Example Incoming Text Message Payload:

{
  "data": {
    "message_type": "text",
    "sender_id": 1,
    "sender_profile_image": "https://example.com/media/users/profile.jpg",
    "message": "Hello, I’d like to ask about your services.",
    "chat_id": 12
  }
}

Example Incoming Image Message Payload:

{
  "data": {
    "message_type": "images",
    "sender_id": 1,
    "sender_profile_image": "https://example.com/media/users/profile.jpg",
    "image_urls": [
      "https://example.com/media/chat_messages/img1.jpg",
      "https://example.com/media/chat_messages/img2.jpg"
    ],
    "chat_id": 12
  }
}

Error Codes:

    4001 → Authentication failed (invalid/missing token)
    4002 → Invalid or missing business ID
    4003 → Invalid chat ID (not accessible by this user)

WebSocket connection for notifications
Real-time Notifications WebSocket

This WebSocket allows authenticated users to receive real-time notifications.
Assuming base url is: 127.0.0.1:8000
Connection URLs:

    User notifications:
    ws://127.0.0.1:8000/notification/?token=<ACCESS_TOKEN>

    Business-specific notifications:
    ws://127.0.0.1:8000/notification/{business_id}/?token=<ACCESS_TOKEN>

Authentication:

    You must pass a valid JWT access token as a query parameter (?token=...).
    If token is missing or invalid, the connection will be rejected.

Notes:

    Use ws:// for development (or insecure).
    Use wss:// for production (or secure).

Example Frontend Usage (JavaScript):

const socket = new WebSocket(
  "ws://127.0.0.1:8000/notification/1/?token=YOUR_ACCESS_TOKEN"
);

socket.onopen = () => {
  console.log("Connected to notification socket");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("New notification:", data);
};

socket.onclose = (event) => {
  console.log("Socket closed:", event.code);
};

Example Notification Payload:

{
  "type": "message_notification",
  "business": 1,
  "user": 5,
  "attached_object_id": 23,
  "is_seen": false,
  "message": "You received a new message",
  "created_when": "2025-09-01T15:45:00Z"
}

Authorizations:
Basic