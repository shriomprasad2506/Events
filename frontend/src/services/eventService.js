import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL

export const event = {
    categories: [
        {
            title: "Workshops",
            subCategories: [
                { title: "Cooking" },
                { title: "Photography" },
                { title: "Coding" },
                { title: "Art" }
            ]
        },
        {
            title: "Conferences",
            subCategories: [
                { title: "Technology" },
                { title: "Health" },
                { title: "Education" },
                { title: "Business" }
            ]
        },
        {
            title: "Social Events",
            subCategories: [
                { title: "Networking" },
                { title: "Fundraising" },
                { title: "Community Service" },
                { title: "Parties" }
            ]
        },
        {
            title: "Webinars",
            subCategories: [
                { title: "Marketing" },
                { title: "Personal Development" },
                { title: "Finance" },
                { title: "Remote Work" }
            ]
        },
        {
            title: "Sports Events",
            subCategories: [
                { title: "Tournaments" },
                { title: "Fitness Classes" },
                { title: "Outdoor Activities" },
                { title: "Team Sports" }
            ]
        }
    ],
    eventFormats: [
        "In-Person",
        "Virtual",
        "Hybrid"
    ]
};

async function generateEventId(){
    try{
        const data = await getEvents()
        const id=data.totalEvents
        console.log(data)
        return `DEEPTHOUGHT_EVENTS_${id+1}`
    } catch(error){
        console.error("Error fetching events: ", error);
    }
}

function formDataConvert(data) {
    const formData = new FormData();
    for (const key in data) {
        if (data[key] !== "")
            formData.append(key, data[key]);
    }
    return formData
}

export async function insertEvent(data) {
    try {
        data.id=await generateEventId();
        console.log(data.id)
        const formData = formDataConvert(data);
        const response = await axios.post(`${API_URL}/events/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;

    } catch (err) {
        console.error("Error Submitting Form: ", err);
    }
}

export async function getEvents() {
    try {
        const response = await axios.get(`${API_URL}/events`)
        const data = response.data
        return data;
    } catch (err) {
        console.error("Error Fetching Events: ", err)
    }
}

export async function deleteEvent(id) {
    try {
        const response = await axios.delete(`${API_URL}/events/${id}`);
        return response;
    } catch (err) {
        console.error("Error Deleting Event: ", err)
    }
}

export async function updateEvent(event){
    try{
        const formData = formDataConvert(event)
        const response = await axios.put(`${API_URL}/events/${event._id}`,formData);
        return response
    } catch(err){
        console.log("Error Updating Event: ",err)
    }
}

export async function getEventsPerPage(limit,page){
    try{
        const response = await axios.get(`${API_URL}/events/?type=latest&limit=${limit}&page=${page}`)
        const data = response.data
        return data
    } catch(err){
        console.log("Error Fetching Events: ",err)
    }
}

export async function searchEvents(query,limit,page){
    try{
        const response = await axios.get(`${API_URL}/events/?search=${query}&limit=${limit}&page=${page}`)
        const data = response.data;
        return data
    } catch(err){
        console.log("Error Searching Events: ",err)
    }
}


