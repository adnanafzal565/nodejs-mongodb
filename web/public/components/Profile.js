function Profile() {

    const [state, setState] = React.useState(globalState.state)
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [profileImage, setProfileImage] = React.useState("")
    const [isSaving, setIsSaving] = React.useState(false)

   // React.useEffect(function () {
        globalState.listen(function (newState) {
            setState(newState)

            if (newState.user != null) {
                setName(newState.user.name)
                setEmail(newState.user.email)
                setProfileImage(newState.user.profileImage)
            }
        })

        /*if (window.userObject != null) {
            setName(window.userObject.name)
            setEmail(window.userObject.email)
            setProfileImage(window.userObject.profile_image)
        }*/
   // }, [])

    async function saveProfile() {
	event.preventDefault()

	if (isDemo) {
		swal.fire("Profile", "Profile has been updated.", "success");
		return;
	}

        try {
		setIsSaving(true)

            const formData = new FormData(event.target)
            const response = await axios.post(
                apiUrl + "/save-profile",
                formData,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem(accessTokenKey)
                    }
                }
            )

            if (response.data.status == "success") {
                swal.fire("Profile", response.data.message, "success")
            } else {
                swal.fire("Error", response.data.message, "error")
            }
        } catch (exp) {
            if (exp.response.status == 401) {
                window.location.href = baseUrl + "/login?redirect=" + window.location.href
            } else {
                swal.fire("Error", exp.message, "error")
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={ saveProfile } encType="multipart/form-data">
            <div className="row" style={{
                marginBottom: "10px"
            }}>
                <div className="offset-4 col-3">
                    <img id="profile-image" style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginBottom: "20px",
                        position: "relative",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }} src={ profileImage }
                        onError={ function (event) {
                            event.target.src = baseUrl + "/public/img/user-placeholder.png"
                        } } />

                    <input type="file" name="profileImage" accept="image/*"
                        onChange={ function (event) {

                            const files = event.target.files
                            if (files.length) {
                                const fileReader = new FileReader()
     
                                fileReader.onload = function (event) {
                                    setProfileImage(event.target.result)
                                    // document.getElementById("preview").setAttribute("src", event.target.result)
                                }
                     
                                fileReader.readAsDataURL(files[0])
                            }
                        } } />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" name="name" value={ name } onChange={ function () {
                    setName(event.target.value)
                } } className="form-control" required />
            </div>

            <div className="form-group" style={{
                marginTop: "10px",
                marginBottom: "15px"
            }}>
                <label className="form-label">Email</label>
                <input type="email" name="email" value={ email } onChange={ function () {
                    setEmail(event.target.value)
                } } className="form-control" disabled />
            </div>

            <input type="submit" name="submit" className="btn btn-outline-primary btn-sm"
                value={ isSaving ? "Saving..." : "Save" }
                disabled={ isSaving } />
        </form>
    )
}

ReactDOM.createRoot(
    document.getElementById("profile-app")
).render(<Profile />)
