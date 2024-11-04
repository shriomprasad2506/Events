import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls"
import * as eventService from "../../services/eventService"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

const eventFormats = eventService.event.eventFormats
const eventCategories = eventService.event.categories

const initialFValues = {
    id: 0,
    name: "",
    tagline: "",
    description: "",
    rigorRank: "",
    moderator: "",
    eventFormat: "In-Person",
    category: "",
    subCategory: "",
    scheduledOn: new Date(),
    memberOnly: false,
    image: "",
    icon: ""
}

export default function EventForm(props) {
    const { addOrEdit, recordForEdit } = props
    const [isSubmitting, setIsSubmitting] = useState(false);
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('moderator' in fieldValues)
            temp.moderator = fieldValues.moderator ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('description' in fieldValues)
            temp.description = fieldValues.description.length > 9 ? "" : "Minimum 10 characters are required."
        if ('category' in fieldValues)
            temp.category = fieldValues.category.length !== 0 ? "" : "This field is required."
        if ('image' in fieldValues)
            temp.image = fieldValues.image ? "" : "Please upload Image."
        setErrors(
            { ...temp }
        )

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const { values, setValues, errors,
        setErrors, handleInputChange, resetForm } = useForm(initialFValues, true, validate)

    const [imagePreview, setImagePreview] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            setIsSubmitting(true);
            addOrEdit(values, resetForm)
            setImagePreview(null);
            setIconPreview(null)
        }
    }

    useEffect(() => {
        setValues((prevValues) => ({
            ...prevValues,
            image: imagePreview ? prevValues.image : "", 
            icon: iconPreview ? prevValues.icon : "" 
        }));
    }, [imagePreview, iconPreview]);

    const handleFileChange = (name) => (e) => {
        const file = e.target.files[0]
        setValues({
            ...values,
            [name]: file,
        });
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (name === 'image') {
                setImagePreview(previewUrl);
            } else if (name === 'icon') {
                setIconPreview(previewUrl);
            }
        }
    };

    useEffect(() => {
        if (recordForEdit != null){
            setValues({
                ...recordForEdit,
            })
            if(recordForEdit.image){
                setImagePreview(recordForEdit.image)
            }
            if(recordForEdit.icon){
                setIconPreview(recordForEdit.icon)
            }
        }

    }, [recordForEdit, setValues])

    const [subCategories, setSubCategories] = useState(null);

    const handleCategoryChange = e => {
        const selectedCategory = e.target.value;
        handleInputChange(e);
        const selectedSubCategories = eventService.event.categories.find(cat => cat.title === selectedCategory)?.subCategories || null;
        setSubCategories(selectedSubCategories);
    };



    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <Controls.Input name="name" label="Name of the Event" value={values.name} onChange={handleInputChange} error={errors.name} disabled={isSubmitting} />
                    <Controls.Input name="tagline" label="Tagline" value={values.tagline} onChange={handleInputChange} disabled={isSubmitting} />
                    <Controls.Input name="description" label="Description" value={values.description} onChange={handleInputChange} error={errors.description} disabled={isSubmitting}  />
                    <Controls.Input name="city" label="City" value={values.city} onChange={handleInputChange} disabled={isSubmitting} />
                    <Controls.Input name="rigorRank" type="number" label="Rigor Rank" value={values.rigorRank} onChange={handleInputChange} disabled={isSubmitting} />
                    <Controls.FileUpload label="Upload Image" name="image" icon={<CloudUploadIcon />} error={errors.image} onChange={handleFileChange('image')} setPreview={setImagePreview} preview={imagePreview} disabled={isSubmitting} />
                    <Controls.FileUpload label="Choose Icon" name='icon' icon={<LocalActivityIcon />} onChange={handleFileChange('icon')} setPreview={setIconPreview} preview={iconPreview} disabled={isSubmitting} />
                </Grid>
                <Grid item xs={6}>
                    <Controls.Input name="moderator" label="Moderator" value={values.moderator} onChange={handleInputChange} error={errors.moderator} disabled={isSubmitting} />
                    <Controls.RadioGroup
                        name="eventFormat"
                        label="Event Format" value={values.eventFormat} onChange={handleInputChange}
                        items={eventFormats}
                        disabled={isSubmitting}
                    />
                    <Controls.Select name="category" label="Category"
                        value={values.category} onChange={handleCategoryChange}
                        options={eventCategories} error={errors.category} disabled={isSubmitting} />

                    {
                        subCategories &&
                        <Controls.Select name="subCategory" label="Sub Category"
                            value={values.subCategory} onChange={handleInputChange} disabled={isSubmitting}
                            options={subCategories} />

                    }

                    <Controls.DatePicker name="scheduledOn" label="Scheduled On" value={new Date(values.scheduledOn)} onChange={handleInputChange} disabled={isSubmitting} />

                    <Controls.CheckBox name="memberOnly" label="Members Only" value={values.memberOnly==="true"} onChange={handleInputChange} disabled={isSubmitting} />
                    <div>
                        <Controls.Button type="submit" text={isSubmitting?"Submitting...":"Submit"} disabled={isSubmitting} />
                        <Controls.Button text="reset" color="default" onClick={()=>{resetForm();setImagePreview(null);setIconPreview(null)}} disabled={isSubmitting} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}