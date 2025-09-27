import { getUserByEmail, createUser } from '../lib/db'
import { hashPassword, generateUsername } from '../lib/auth-utils'

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await getUserByEmail('admin@thesundaytraveller.com')

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    const adminPassword = await hashPassword('admin123')
    const adminUsername = generateUsername('admin@thesundaytraveller.com')

    await createUser({
      email: 'admin@thesundaytraveller.com',
      username: adminUsername,
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    })

    console.log('Admin user created successfully')
    console.log('Email: admin@thesundaytraveller.com')
    console.log('Password: admin123')
    console.log('Role: admin')

    // Create editor user
    const existingEditor = await getUserByEmail('editor@thesundaytraveller.com')

    if (!existingEditor) {
      const editorPassword = await hashPassword('editor123')
      const editorUsername = generateUsername('editor@thesundaytraveller.com')

      await createUser({
        email: 'editor@thesundaytraveller.com',
        username: editorUsername,
        passwordHash: editorPassword,
        firstName: 'Editor',
        lastName: 'User',
        role: 'editor',
        isActive: true,
      })

      console.log('Editor user created successfully')
      console.log('Email: editor@thesundaytraveller.com')
      console.log('Password: editor123')
      console.log('Role: editor')
    }

    // Create author user
    const existingAuthor = await getUserByEmail('author@thesundaytraveller.com')

    if (!existingAuthor) {
      const authorPassword = await hashPassword('author123')
      const authorUsername = generateUsername('author@thesundaytraveller.com')

      await createUser({
        email: 'author@thesundaytraveller.com',
        username: authorUsername,
        passwordHash: authorPassword,
        firstName: 'Author',
        lastName: 'User',
        role: 'author',
        isActive: true,
      })

      console.log('Author user created successfully')
      console.log('Email: author@thesundaytraveller.com')
      console.log('Password: author123')
      console.log('Role: author')
    }

  } catch (error) {
    console.error('Error creating users:', error)
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('User creation script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })