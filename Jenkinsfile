pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'isresearch/dpms-web'
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        NODE_VERSION = '20'
    }

    tools {
        nodejs "Node ${NODE_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    corepack enable
                    pnpm install --frozen-lockfile
                '''
            }
        }

        stage('Build and Test') {
            steps {
                sh '''
                    pnpm run build --configuration=production
                    pnpm test --configuration=production
                '''
            }
        }

        stage('Docker Test') {
            steps {
                sh """
                    docker --version
                    docker info
                    echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
                    docker logout
                """
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                    docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Docker Push') {
            steps {
                sh """
                    echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
                    docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    docker push ${DOCKER_IMAGE}:latest
                    docker logout
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
